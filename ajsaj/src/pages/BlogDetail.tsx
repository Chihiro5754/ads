import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSupabase } from '../contexts/SupabaseContext'
import { BlogPost, Comment } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const BlogDetail = () => {
  const supabase = useSupabase()
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!id) return

      try {
        // 获取文章详情
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single()

        if (postError) throw postError

        if (postData) {
          setPost(postData)
          
          // 增加浏览量
          await supabase
            .from('blog_posts')
            .update({ view_count: postData.view_count + 1 })
            .eq('id', id)
        }

        // 获取评论
        const { data: commentData, error: commentError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', id)
          .order('created_at', { ascending: true })

        if (commentError) throw commentError
        setComments(commentData || [])
      } catch (error) {
        console.error('获取文章详情失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPostAndComments()
  }, [supabase, id])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !post) return

    if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
      alert('请填写所有字段')
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          user_name: commentForm.name,
          user_email: commentForm.email,
          content: commentForm.content
        })

      if (error) throw error

      // 重新获取评论
      const { data: newComments } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (newComments) setComments(newComments)

      // 清空表单
      setCommentForm({ name: '', email: '', content: '' })
      alert('评论发表成功！')
    } catch (error) {
      console.error('发表评论失败:', error)
      alert('发表评论失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
          <Link to="/blog" className="btn-primary">
            返回博客列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <article className="mb-12">
          <div className="mb-8">
            <Link to="/blog" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
              ← 返回博客列表
            </Link>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                {post.category}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
              <span className="text-xs text-gray-500">
                阅读量: {post.view_count + 1}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

            <div className="flex items-center space-x-3 mb-8">
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-600">
                    {post.author_name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{post.author_name}</div>
                <div className="text-sm text-gray-500">作者</div>
              </div>
            </div>

            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>

            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">评论 ({comments.length})</h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">发表评论</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="姓名"
                value={commentForm.name}
                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="邮箱"
                value={commentForm.email}
                onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <textarea
              placeholder="评论内容..."
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              rows={4}
              className="input-field mb-4"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? '发表中...' : '发表评论'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-6 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm text-gray-600">
                        {comment.user_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{comment.user_name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无评论，来发表第一个评论吧！
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BlogDetail
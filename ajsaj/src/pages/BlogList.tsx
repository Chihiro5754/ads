import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { BlogPost } from '../types'
import BlogCard from '../components/BlogCard'

const BlogList = () => {
  const supabase = useSupabase()
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let query = supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (selectedCategory) {
          query = query.eq('category', selectedCategory)
        }

        const { data, error } = await query

        if (error) throw error
        setPosts(data || [])

        // 提取所有分类
        const { data: allPosts } = await supabase
          .from('blog_posts')
          .select('category')
          .eq('published', true)

        if (allPosts) {
          const uniqueCategories = [...new Set(allPosts.map(post => post.category))]
          setCategories(uniqueCategories)
        }
      } catch (error) {
        console.error('获取博客列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase, selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category) {
      setSearchParams({ category })
    } else {
      setSearchParams({})
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">技术博客</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            分享技术心得，记录学习历程，与开发者社区共同成长
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedCategory ? `暂无 ${selectedCategory} 分类文章` : '暂无博客文章'}
            </h3>
            <p className="text-gray-600">
              {selectedCategory 
                ? '试试其他分类，或者稍后再来看看'
                : '还没有发布任何博客文章'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList
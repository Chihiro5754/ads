import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { BlogPost, PortfolioItem } from '../types'
import BlogCard from '../components/BlogCard'
import PortfolioCard from '../components/PortfolioCard'

const Home = () => {
  const supabase = useSupabase()
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, projectsRes] = await Promise.all([
          supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('portfolio_items')
            .select('*')
            .eq('featured', true)
            .order('order', { ascending: true })
        ])

        if (postsRes.data) setLatestPosts(postsRes.data)
        if (projectsRes.data) setFeaturedProjects(projectsRes.data)
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              欢迎来到博客工坊
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              分享技术心得，展示创意作品，与志同道合的朋友一起成长
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog" className="btn-primary bg-white text-primary-600 hover:bg-gray-50">
                阅读博客
              </Link>
              <Link to="/portfolio" className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-primary-600">
                查看作品集
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">最新博客</h2>
            <Link
              to="/blog"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>
          
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无博客文章</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">精选作品</h2>
            <Link
              to="/portfolio"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>
          
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <PortfolioCard key={project.id} item={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无精选作品</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">
                {latestPosts.length}+
              </div>
              <div className="text-primary-100">技术文章</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {featuredProjects.length}+
              </div>
              <div className="text-primary-100">开源项目</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-primary-100">学习热情</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
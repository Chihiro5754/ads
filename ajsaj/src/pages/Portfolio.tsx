import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { PortfolioItem } from '../types'
import PortfolioCard from '../components/PortfolioCard'

const Portfolio = () => {
  const supabase = useSupabase()
  const [projects, setProjects] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('featured', { ascending: false })
          .order('order', { ascending: true })

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error('获取作品集失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            作品集展示
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            这里展示了我的各种项目作品，包括Web应用、开源项目和实验性作品。
            每个项目都体现了技术的深度和创意的广度。
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="text-yellow-500 mr-2">⭐</span>
              精选项目
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <PortfolioCard key={project.id} item={project} />
              ))}
            </div>
          </section>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">其他项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project) => (
                <PortfolioCard key={project.id} item={project} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              暂无展示项目
            </h3>
            <p className="text-gray-600">
              项目正在开发中，敬请期待...
            </p>
          </div>
        )}

        {/* Skills Section */}
        <section className="mt-20 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">技术栈</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'React', 'TypeScript', 'Node.js', 'Python',
              'Supabase', 'MongoDB', 'PostgreSQL', 'Tailwind CSS',
              'Vue.js', 'Docker', 'Git', 'AWS'
            ].map((skill) => (
              <div
                key={skill}
                className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-center font-medium"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Portfolio
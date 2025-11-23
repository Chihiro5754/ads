import { PortfolioItem } from '../types'

interface PortfolioCardProps {
  item: PortfolioItem
}

const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
          {item.featured && (
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              精选
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {item.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
          {item.technologies.length > 4 && (
            <span className="text-xs text-gray-500">
              +{item.technologies.length - 4} 更多
            </span>
          )}
        </div>
        
        <div className="flex space-x-3">
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-1 px-3"
            >
              查看项目
            </a>
          )}
          {item.github_url && (
            <a
              href={item.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-1 px-3"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortfolioCard
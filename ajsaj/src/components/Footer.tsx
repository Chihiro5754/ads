const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于博客工坊</h3>
            <p className="text-gray-300 text-sm">
              一个专注于技术分享和作品展示的现代化博客平台，使用 React 和 Supabase 构建。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">技术栈</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>React & TypeScript</li>
              <li>Supabase</li>
              <li>Tailwind CSS</li>
              <li>Vite</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">联系方式</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Email: admin@example.com</li>
              <li>GitHub: @username</li>
              <li>技术分享，共同成长</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} 博客工坊. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
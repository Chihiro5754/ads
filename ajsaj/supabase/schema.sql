-- 创建用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建博客文章表
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT DEFAULT '技术',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建评论表
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建作品集表
CREATE TABLE portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_url TEXT,
  github_url TEXT,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_portfolio_items_featured ON portfolio_items(featured);

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "公开查看博客文章" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "公开查看评论" ON comments FOR SELECT USING (true);
CREATE POLICY "公开查看作品集" ON portfolio_items FOR SELECT USING (true);

-- 插入示例数据
INSERT INTO users (email, name, bio) VALUES 
('admin@example.com', '管理员', '热爱技术的全栈开发者');

INSERT INTO portfolio_items (title, description, technologies, featured, order) VALUES 
('个人博客平台', '使用 React 和 Supabase 构建的现代化博客平台', ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS'], true, 1),
('任务管理系统', '基于 Web 的团队协作和项目管理工具', ARRAY['Vue.js', 'Node.js', 'MongoDB'], true, 2),
('数据可视化平台', '实时数据分析和可视化展示系统', ARRAY['D3.js', 'Python', 'PostgreSQL'], false, 3);

INSERT INTO blog_posts (title, content, excerpt, author_id, author_name, category, tags) VALUES 
('欢迎来到我的博客', '# 欢迎来到我的个人博客\n\n这是一个使用现代技术栈构建的博客平台...', '欢迎来到我的个人博客，这里分享技术心得和项目经验', 
 (SELECT id FROM users LIMIT 1), '管理员', '技术', ARRAY['博客', '介绍', '技术栈']),
'React 最佳实践指南', '# React 最佳实践指南\n\n在开发 React 应用时，遵循最佳实践...', '分享在 React 开发中的最佳实践和经验技巧',
 (SELECT id FROM users LIMIT 1), '管理员', '技术', ARRAY['React', 'JavaScript', '最佳实践']),
'全栈开发之路', '# 全栈开发之路\n\n全栈开发需要掌握的技能栈...', '探讨全栈开发者需要掌握的技术和能力',
 (SELECT id FROM users LIMIT 1), '管理员', '技术', ARRAY['全栈', '职业发展', '技能树']);
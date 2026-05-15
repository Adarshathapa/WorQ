import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS } from '../src/constants.js'; // Need to be careful here if we compile or run via tsx.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://worq-ai.in';

// The statically known blog posts
const BLOG_POSTS = [
  'merge-pdf-online-free',
  'top-pdf-tools-2026',
  'compress-pdf-without-losing-quality',
  'pdf-to-word-free'
];

async function generateSitemap() {
  const date = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const addUrl = (loc: string, priority: string, changefreq: string) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${loc}</loc>\n`;
    xml += `    <lastmod>${date}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  };

  // Core Pages
  addUrl('/', '1.0', 'daily');
  addUrl('/tools', '0.8', 'daily');
  addUrl('/pdf-tools', '0.8', 'weekly');
  addUrl('/image-tools', '0.8', 'weekly');
  addUrl('/conversion-tools', '0.8', 'weekly');
  addUrl('/scanning-tools', '0.8', 'weekly');

  // Tool Specific Pages
  for (const tool of TOOLS) {
    if (tool.id === 'my-files' || tool.id === 'all-tools') continue;
    
    if (['merge-pdf', 'compress-pdf', 'jpg-to-pdf'].includes(tool.id)) {
        addUrl(`/${tool.id}`, '0.9', 'weekly');
    } else {
        let categorySlug = 'pdf-tools';
        if (tool.category === 'image') categorySlug = 'image-tools';
        else if (tool.category === 'conversion') categorySlug = 'conversion-tools';
        else if (tool.category === 'scan_files') categorySlug = 'scanning-tools';
        else if (tool.category === 'ai_tools') categorySlug = 'ai-tools';
        
        addUrl(`/${categorySlug}/${tool.id}`, '0.9', 'weekly');
    }
  }

  // Blog Posts
  for (const post of BLOG_POSTS) {
    addUrl(`/blog/${post}`, '0.7', 'monthly');
  }

  xml += `</urlset>\n`;

  const publicPath = path.join(__dirname, '../public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }

  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml, 'utf8');
  console.log('Sitemap successfully generated at public/sitemap.xml');
}

generateSitemap().catch(console.error);

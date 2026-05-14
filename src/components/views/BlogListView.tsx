import React from 'react';
import { MdArrowBack, MdArticle } from 'react-icons/md';
import { SEO } from '../ui/SEO';

interface BlogListViewProps {
  onBack: () => void;
  onBlogClick: (slug: string) => void;
}

export const BlogListView: React.FC<BlogListViewProps> = ({ onBack, onBlogClick }) => {
  const blogs = [
    {
      slug: 'merge-pdf-online-free',
      title: 'Merge PDF Online Free (No Signup, Fast & Secure)',
      description: 'Merge PDF Online Free – Combine PDF Files Easily in Seconds.',
      date: 'May 10, 2026'
    },
    {
      slug: 'compress-pdf-without-losing-quality',
      title: 'Compress PDF Without Losing Quality – Reduce File Size Easily',
      description: 'Compress PDF without losing quality easily. Best methods to reduce your PDF file size.',
      date: 'May 10, 2026'
    },
    {
      slug: 'pdf-to-word-free',
      title: 'Convert PDF to Word Free – Edit Any PDF Easily',
      description: 'Convert PDF to Word Free – Edit Any PDF Easily without losing layout.',
      date: 'May 10, 2026'
    },
    {
      slug: 'top-pdf-tools-2026',
      title: 'Top 5 Free PDF Tools You Must Try in 2026',
      description: 'Discover the top PDF tools in 2026. Merge, compress, convert and manage PDF files easily.',
      date: 'May 10, 2026'
    }
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-8 pb-32">
      <SEO 
        title="All Blog Posts | WorQ-AI" 
        description="Read our latest guides, tips, and tutorials about PDF tools, document management, and productivity."
      />
      
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#FF8A3D] transition-colors mb-8 group"
      >
        <MdArrowBack size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-[15px]">Back to Home</span>
      </button>

      <div className="mb-10 lg:mb-14 text-center sm:text-left">
        <h1 className="text-[32px] sm:text-[40px] font-black text-gray-900 dark:text-white tracking-tight mb-4 font-display">
          Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-orange-500">Articles & Guides</span>
        </h1>
        <p className="text-[16px] sm:text-[18px] text-gray-500 dark:text-gray-400 max-w-2xl">
          Discover tips, updates, and deep dives into document management and productivity hacks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {blogs.map((blog) => (
          <div 
            key={blog.slug}
            onClick={() => onBlogClick(blog.slug)}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform -rotate-6 group-hover:rotate-0">
               <MdArticle size={24} />
            </div>
            
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 block">
               {blog.date}
            </span>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-orange-500 transition-colors">
              {blog.title}
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-6">
              {blog.description}
            </p>
            
            <div className="flex items-center text-orange-500 font-semibold text-[15px] group-hover:gap-3 gap-2 transition-all">
              Read Article <span className="text-lg">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

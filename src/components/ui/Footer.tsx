import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MdClose } from 'react-icons/md';

export const Footer: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
       window.history.pushState({ scrollPos: 0 }, '', path);
       window.dispatchEvent(new PopStateEvent('popstate', { state: { scrollPos: 0 } }));
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const legalContent = {
    privacy: {
      title: 'Privacy Policy',
      content: 'Your privacy is important to us. WorQ-Ai processes all files locally on your device. We do not upload, store, or share your personal data or files with any external servers. Any data processed remains in your browser session and is deleted when you close the app or clear your history.'
    },
    terms: {
      title: 'Terms & Conditions',
      content: 'By using WorQ-Ai, you agree that the service is provided "as is" without any warranties. We are not responsible for any data loss or issues arising from the use of our local file processing tools. You retain all rights to your content.'
    },
    disclaimer: {
      title: 'Disclaimer',
      content: 'WorQ-Ai is a client-side utility tool. While we use industry-standard libraries for file processing, results may vary. Always keep backups of your original files. We are not affiliated with any third-party services mentioned unless explicitly stated.'
    }
  };

  return (
    <footer className="mt-12 w-full border-t border-[#EEF0F5] dark:border-slate-800 bg-[#F8F9FC] dark:bg-slate-900 pb-[80px] md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-[1200px] px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-3">
          <div 
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => navigate('/')}
          >
            <div className="w-[28px] h-[28px] rounded-lg bg-linear-to-br from-[#FF2D55] to-[#FF8A3D] flex items-center justify-center shadow-md">
              <span className="text-[16px] font-black text-white leading-none font-display">W</span>
            </div>
            <h1 className="text-[20px] text-[#111827] dark:text-white leading-none tracking-tight font-display flex items-baseline">
              <span className="font-extrabold tracking-tight">WorQ</span>
              <span className="font-light text-brand-gradient ml-[1.5px] tracking-[0.15em]">-AI</span>
            </h1>
          </div>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 max-w-[250px] leading-relaxed">
            Fast, secure, and smart local file processing right in your browser.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-row gap-12 md:gap-16">
          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[12px] font-bold text-[#111827] dark:text-gray-200 uppercase tracking-widest mb-1">Platform</h4>
            <button onClick={() => navigate('/')} className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 hover:text-brand-pink transition-colors text-left">Home</button>
            <button onClick={() => navigate('/pdf-tools')} className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 hover:text-brand-pink transition-colors text-left">All Tools</button>
            <button onClick={() => navigate('/file-manager')} className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 hover:text-brand-pink transition-colors text-left">My Files</button>
          </div>
          
          {/* Legal / Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[12px] font-bold text-[#111827] dark:text-gray-200 uppercase tracking-widest mb-1">Legal</h4>
            <button onClick={() => setActiveLayer('privacy')} className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 hover:text-brand-pink transition-colors text-left">Privacy Policy</button>
            <button onClick={() => setActiveLayer('terms')} className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 hover:text-brand-pink transition-colors text-left">Terms of Service</button>
            <button onClick={() => setActiveLayer('disclaimer')} className="text-[13px] font-medium text-[#6B7280] dark:text-gray-400 hover:text-brand-pink transition-colors text-left">Disclaimer</button>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="w-full max-w-[1200px] border-t border-[#EEF0F5] dark:border-slate-800 px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[12px] text-[#9CA3AF] dark:text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} WorQ-AI. All rights reserved.
        </p>
        <div className="flex flex-col items-center gap-1">
           <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
             WorQ-Ai v1.1
           </span>
           <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] dark:text-gray-500 font-medium">
             <span>Made with precision</span>
             <span className="text-brand-pink">&hearts;</span>
           </div>
        </div>
      </div>

      {/* LEGAL MODAL */}
      <AnimatePresence>
        {activeLayer && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLayer(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] p-6 pb-12 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">
                  {legalContent[activeLayer].title}
                </h3>
                <button 
                  onClick={() => setActiveLayer(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500"
                >
                  <MdClose size={20} />
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert">
                <p className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {legalContent[activeLayer].content}
                </p>
              </div>
              <button 
                onClick={() => setActiveLayer(null)}
                className="w-full mt-8 py-3.5 bg-gray-900 dark:bg-slate-800 text-white rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

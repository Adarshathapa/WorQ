import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MdClose } from 'react-icons/md';
import { FileStack, ShieldCheck, Globe, ChevronDown, CheckCircle2, ChevronRight, Shield, Zap, AppWindow, Users } from 'lucide-react';
import { Icon } from './Icon';

export const Footer: React.FC = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
       window.history.pushState({ scrollPos: 0 }, '', path);
       window.dispatchEvent(new PopStateEvent('popstate', { state: { scrollPos: 0 } }));
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLink = (type: string, path?: string) => {
    if (path) {
      navigate(path);
    } else {
      setToastMsg(`${type} is coming soon!`);
    }
  };

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  return (
    <footer className="w-full bg-white flex flex-col items-center relative overflow-hidden mt-auto border-t border-gray-100">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[300] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-3 font-medium transition-all"
          >
            <Zap size={18} className="text-[#FF8A3D]" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#FF8A3D]/10 via-white to-white pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[50%] -translate-x-[50%] w-[60%] h-[40%] bg-[#FF8A3D]/10 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-[#FF8A3D]/20 to-transparent opacity-50" />
      
      <div className="w-full max-w-[1200px] px-5 sm:px-8 md:px-12 pt-16 sm:pt-20 pb-5 sm:pb-7 flex flex-col relative z-10">
        
        {/* TOP SECTION: Ad Banner */}
        <div className="w-full mb-20 border-b border-gray-200 pb-16 relative overflow-hidden">
          <a href="https://link.super.money/ZsgcLKVBRZb" target="_blank" rel="noopener noreferrer" className="block w-full rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
             <img 
               src="https://i.ibb.co/60s14kYT/file-00000000394c720bbd0a1f5b964fe8e2.png" 
               alt="super.money Ad" 
               className="w-full h-auto object-cover block"
             />
          </a>
        </div>

        {/* MIDDLE SECTION: Links & Brand */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 w-full mb-16 sm:mb-20">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6 lg:w-[320px]">
            <div 
              className="flex items-center gap-3 cursor-pointer group w-fit"
              onClick={() => handleLink('Home', '/')}
            >
               <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FFA568] to-[#FF7A18] flex items-center justify-center shadow-[0_4px_12px_rgba(255,138,61,0.2)] border border-[#FF8A3D]/20">
                 <FileStack className="text-white w-5 h-5" strokeWidth={2.5} />
               </div>
              <div className="text-[24px] text-[#111827] leading-none tracking-tight font-display flex items-baseline">
                <span className="font-extrabold tracking-tight">WorQ</span>
                <span className="font-medium text-[#FF8A3D] ml-[1px] text-[16px] tracking-[0.08em]">-AI</span>
              </div>
            </div>
            
            <p className="text-[14px] text-gray-500 font-medium leading-[1.6]">
              All-in-one AI platform for documents, images & more.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-2">
              {['Twitter', 'Linkedin', 'Youtube', 'Github'].map((icon, i) => (
                 <button key={i} onClick={() => handleLink(icon)} className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#FF8A3D] hover:bg-orange-50 transition-all duration-300">
                   <Icon name={icon} className="w-4 h-4" />
                 </button>
              ))}
            </div>
          </div>
          
          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 flex-1">
            {/* Column 1 */}
            <div className="flex flex-col gap-5">
              <h4 className="text-[14px] font-bold text-[#FF8A3D] tracking-wide">Product</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleLink('All Tools', '/tools')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">All Tools</button>
                <button onClick={() => handleLink('AI Chat', '/ai-tools/ai-chat')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">AI Chat</button>
                <button onClick={() => handleLink('Templates')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Templates</button>
                <button onClick={() => handleLink('Integrations')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Integrations</button>
                <button onClick={() => handleLink('Updates')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Updates</button>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col gap-5">
              <h4 className="text-[14px] font-bold text-[#FF8A3D] tracking-wide">Solutions</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleLink('For Teams')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">For Teams</button>
                <button onClick={() => handleLink('For Education')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">For Education</button>
                <button onClick={() => handleLink('For Business')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">For Business</button>
                <button onClick={() => handleLink('Developers')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Developers</button>
                <button onClick={() => handleLink('API')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">API</button>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-5">
              <h4 className="text-[14px] font-bold text-[#FF8A3D] tracking-wide">Resources</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleLink('Documentation')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Documentation</button>
                <button onClick={() => handleLink('Guides')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Guides</button>
                <button onClick={() => handleLink('Blog', '/blogs')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Blog</button>
                <button onClick={() => handleLink('Help Center')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Help Center</button>
                <button onClick={() => handleLink('Community')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Community</button>
              </div>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-5">
              <h4 className="text-[14px] font-bold text-[#FF8A3D] tracking-wide">Company</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleLink('About Us', '/about-us')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">About Us</button>
                <button onClick={() => handleLink('Careers')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Careers</button>
                <button onClick={() => handleLink('Press')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Press</button>
                <button onClick={() => handleLink('Contact')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Contact</button>
                <button onClick={() => handleLink('Partners')} className="text-left text-[14px] text-gray-500 hover:text-[#FF8A3D] transition-colors">Partners</button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="w-full pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[13px] text-gray-500 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} WorQ-AI. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-[13px] text-gray-500 font-medium">
             <button onClick={() => handleLink('Privacy Policy', '/privacy-policy')} className="hover:text-[#FF8A3D] transition-colors">Privacy Policy</button>
             <button onClick={() => handleLink('Terms of Service', '/terms-of-service')} className="hover:text-[#FF8A3D] transition-colors">Terms of Service</button>
             <button onClick={() => handleLink('Security', '/security')} className="hover:text-[#FF8A3D] transition-colors">Security</button>
             
             <button onClick={() => handleLink('Language Selection')} className="flex items-center gap-1.5 text-gray-500 hover:text-[#FF8A3D] transition-all bg-gray-50 hover:bg-orange-50 px-3 py-1.5 rounded-full border border-gray-200 ml-2">
               <Globe size={14} className="text-current" />
               <span>English</span>
               <ChevronDown size={14} />
             </button>
          </div>
        </div>
      </div>

    </footer>
  );
};


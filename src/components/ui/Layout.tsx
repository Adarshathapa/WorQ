import React, { useState } from 'react';
import { MdHome, MdApps, MdFolder, MdMenu, MdClose, MdSearch, MdSettings } from 'react-icons/md';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../../types';
import { InstallPrompt } from './InstallPrompt';
import { Footer } from './Footer';
import { FileStack, ChevronDown, Sparkles } from 'lucide-react';

interface LayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#FAFAFB] flex flex-col relative font-sans">
      <InstallPrompt />

      {/* Top Navbar */}
      <div className="absolute top-0 left-0 right-0 z-50 px-0 md:px-4 pt-0 md:pt-4 pointer-events-none flex justify-center">
        <header className="pointer-events-auto w-full md:max-w-[1000px] h-[60px] md:h-[64px] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-transparent border-none shadow-none backdrop-filter-none">
          
          {/* Logo - Left */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] group shrink-0"
            onClick={() => onTabChange('home')}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-[10px] md:rounded-xl bg-[#111827] flex items-center justify-center shadow-lg shadow-black/10 border border-white/10 relative overflow-hidden transition-all group-hover:bg-[#FF8A3D]">
              <FileStack className="text-white w-4 h-4 md:w-4 md:h-4" strokeWidth={2.5} />
            </div>
            <h1 className="text-[17px] md:text-[20px] text-[#111827] leading-none tracking-tight font-display flex items-baseline">
              <span className="font-extrabold tracking-tight">WorQ</span>
              <span className="font-medium text-gray-400 ml-[1px] tracking-[0.1em] text-[12px] md:text-[13px]">-AI</span>
            </h1>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 p-1 bg-transparent border-none shadow-none">
            <button onClick={() => onTabChange('tools')} className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-white rounded-full transition-all group">
              Tools <ChevronDown size={12} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
            <button onClick={() => onTabChange('home')} className="px-4 py-1.5 text-[13px] font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-white rounded-full transition-all">
              Features
            </button>
            <button onClick={() => onTabChange('blog')} className="px-4 py-1.5 text-[13px] font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-white rounded-full transition-all">
              Blog
            </button>
            <button className="px-4 py-1.5 text-[13px] font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-white rounded-full transition-all">
              Help
            </button>
          </nav>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button onClick={() => onTabChange('tools')} className="hidden sm:flex px-5 py-2 text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1F2937] hover:shadow-md hover:-translate-y-px rounded-full transition-all items-center gap-1.5">
               Explore Tools
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full active:scale-95 transition-all outline-none"
            >
              <MdMenu size={24} />
            </button>
            
            <button 
              className="hidden lg:flex p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full active:scale-95 transition-all outline-none"
            >
              <MdMenu size={22} />
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Slide Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#111827]/30 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[110] flex flex-col shadow-2xl overflow-hidden md:hidden rounded-l-[32px] border-l border-orange-100/50"
            >
              {/* Header */}
              <div className="h-[80px] flex items-center justify-between px-6 border-b border-gray-100 bg-orange-50/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-[#111827] flex items-center justify-center shadow-md relative overflow-hidden">
                    <FileStack className="text-white w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <h1 className="text-[18px] text-[#111827] leading-none tracking-tight font-display flex items-baseline">
                    <span className="font-extrabold tracking-tight">WorQ</span>
                    <span className="font-medium text-[#FF8A3D] ml-[1px] tracking-[0.1em] text-[11px]">-AI</span>
                  </h1>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 active:scale-95 transition-all bg-white shadow-sm border border-gray-100 rounded-full"
                >
                  <MdClose size={18} />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-2 pt-2">Main Menu</span>
                <SidebarItem icon={<MdHome size={22} />} label="Home" isActive={activeTab === 'home'} onClick={() => { onTabChange('home'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<MdApps size={22} />} label="All Tools" isActive={activeTab === 'tools'} onClick={() => { onTabChange('tools'); setIsMobileMenuOpen(false); }} />
                
                <div className="my-2 border-t border-gray-100" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-2">Workspace</span>
                <SidebarItem icon={<MdFolder size={22} />} label="My Files" isActive={activeTab === 'files'} onClick={() => { onTabChange('files'); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<MdSettings size={22} />} label="Settings" isActive={activeTab === 'settings'} onClick={() => { onTabChange('settings'); setIsMobileMenuOpen(false); }} />
              </div>
              
              {/* Footer CTA */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => { onTabChange('tools'); setIsMobileMenuOpen(false); }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(255,138,61,0.2)] hover:shadow-[0_12px_20px_rgba(255,138,61,0.3)] active:scale-[0.98] transition-all"
                >
                  Explore Free Tools
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col w-full relative pt-[72px] pb-[100px] md:pb-0 z-10 overflow-x-hidden">
        <div className="flex-1 w-full">
          {children}
        </div>
        <Footer />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 sm:left-6 sm:right-6 h-[72px] bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl flex items-center justify-around px-2 sm:px-4 z-50 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18),0_0_20px_rgba(255,255,255,0.9)_inset]">
        <NavItem icon={<MdHome size={24} />} label="Home" isActive={activeTab === 'home'} onClick={() => onTabChange('home')} />
        <NavItem icon={<MdApps size={24} />} label="Tools" isActive={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
        <NavItem icon={<MdFolder size={24} />} label="Files" isActive={activeTab === 'files'} onClick={() => onTabChange('files')} />
        <NavItem icon={<MdSettings size={24} />} label="Settings" isActive={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 h-full gap-1 active:scale-95 transition-all duration-300 relative ${
        isActive ? 'text-[#FF8A3D]' : 'text-gray-400 hover:text-gray-900'
      }`}
    >
      <div className={`flex items-center justify-center transition-all duration-500 ${isActive ? '-translate-y-1 scale-110 drop-shadow-sm' : ''}`}>
        {React.cloneElement(icon as React.ReactElement<any>)}
      </div>
      <span className={`text-[11px] font-bold tracking-wide transition-all duration-500 ${isActive ? 'opacity-100 -translate-y-0.5' : 'opacity-0 translate-y-2 absolute'}`}>
        {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="mobileNavIndicator"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-gradient-to-r from-[#FF8A3D] to-[#FF7A18] shadow-[0_2px_8px_rgba(255,138,61,0.5)]"
        />
      )}
    </button>
  );
};

const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-bold active:scale-[0.98] ${
        isActive 
          ? 'bg-[#FF8A3D]/10 text-[#FF8A3D]' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: isActive ? 'text-[#FF8A3D]' : 'text-gray-400'
      })}
      <span className="text-[15px]">{label}</span>
    </button>
  );
};



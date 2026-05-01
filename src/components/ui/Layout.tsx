import React, { useState } from 'react';
import { MdHome, MdApps, MdHistory, MdSettings, MdFolder, MdMenu, MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../../types';
import { InstallPrompt } from './InstallPrompt';
import { Footer } from './Footer';
import { useSettings } from '../../hooks/useSettings';
import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const { isDarkMode, toggleDarkMode } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-bg-light dark:bg-slate-950 flex flex-col relative transition-colors duration-300 pt-[64px] md:pt-[72px] pb-[64px] md:pb-0">
      <InstallPrompt />

      {/* Universal Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-[64px] md:h-[72px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#EEF0F5] dark:border-slate-800 z-50 shadow-sm">
        <div className="flex items-center justify-between w-full h-full px-4 md:px-8 relative">
          
          {/* Left: Hamburger Menu Icon & Desktop Menu */}
          <div className="flex items-center flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-[#111827] dark:text-white active:scale-95 transition-transform"
            >
              <MdMenu size={28} />
            </button>

            <nav className="hidden md:flex items-center gap-8">
              <DesktopNavItem icon={<MdHome size={20} />} label="Home" isActive={activeTab === 'home'} onClick={() => onTabChange('home')} />
              <DesktopNavItem icon={<MdApps size={20} />} label="Tools" isActive={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
              <DesktopNavItem icon={<MdFolder size={20} />} label="Files" isActive={activeTab === 'files'} onClick={() => onTabChange('files')} />
              <DesktopNavItem icon={<MdSettings size={20} />} label="Settings" isActive={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
            </nav>
          </div>

          {/* Center: Logo (Perfectly Centered) */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => onTabChange('home')}
          >
            <div className="w-[32px] h-[32px] rounded-lg bg-linear-to-br from-[#FF2D55] to-[#FF8A3D] flex items-center justify-center shadow-md">
              <span className="text-[18px] font-black text-white leading-none font-display">W</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[20px] md:text-[22px] text-[#111827] dark:text-white leading-none tracking-tight font-display flex items-baseline">
                <span className="font-extrabold tracking-tight">WorQ</span>
                <span className="font-light text-brand-gradient ml-[1.5px] tracking-[0.15em]">-AI</span>
              </h1>
            </div>
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center flex-1 justify-end">
            <button 
              onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-[#E5E7EB] dark:border-slate-700 active:scale-95 transition-all duration-300 relative group ${
                isDarkMode 
                  ? 'text-yellow-400 shadow-[0_0_15px_-3px_rgba(250,204,21,0.4)]' 
                  : 'text-brand-pink shadow-[0_0_15px_-3px_rgba(255,107,157,0.4)]'
              }`}
            >
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-current blur-md scale-75" />
              <div className="relative z-10">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-[#111827]/40 dark:bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 border-r border-[#EEF0F5] dark:border-slate-800 z-[110] md:hidden flex flex-col shadow-2xl"
            >
              <div className="h-[64px] flex items-center justify-between px-4 border-b border-[#EEF0F5] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-[32px] h-[32px] rounded-lg bg-linear-to-br from-[#FF2D55] to-[#FF8A3D] flex items-center justify-center shadow-sm">
                    <span className="text-[18px] font-black text-white leading-none font-display">W</span>
                  </div>
                  <h1 className="text-[22px] text-[#111827] dark:text-white leading-none tracking-tight font-display flex items-baseline">
                    <span className="font-extrabold tracking-tight">WorQ</span>
                    <span className="font-light text-brand-gradient ml-[1.5px] tracking-[0.15em]">-AI</span>
                  </h1>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 -mr-2 text-[#6B7280] hover:text-[#111827] dark:text-gray-400 dark:hover:text-white active:scale-95 transition-all"
                >
                  <MdClose size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
                <SidebarItem icon={<MdHome size={22} />} label="Home" isActive={activeTab === 'home'} onClick={() => { onTabChange('home'); setIsSidebarOpen(false); }} />
                <SidebarItem icon={<MdApps size={22} />} label="Tools" isActive={activeTab === 'tools'} onClick={() => { onTabChange('tools'); setIsSidebarOpen(false); }} />
                <SidebarItem icon={<MdFolder size={22} />} label="Files" isActive={activeTab === 'files'} onClick={() => { onTabChange('files'); setIsSidebarOpen(false); }} />
                <SidebarItem icon={<MdSettings size={22} />} label="Settings" isActive={activeTab === 'settings'} onClick={() => { onTabChange('settings'); setIsSidebarOpen(false); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full flex flex-col relative">
        <div className="flex-1 w-full relative">
          {children}
        </div>
        <Footer />
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white dark:bg-slate-900 border-t border-[#EEF0F5] dark:border-slate-800 flex items-center justify-around px-2 pb-safe z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <NavItem icon={<MdHome />} label="Home" isActive={activeTab === 'home'} onClick={() => onTabChange('home')} />
        <NavItem icon={<MdApps />} label="Tools" isActive={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
        <NavItem icon={<MdFolder />} label="Files" isActive={activeTab === 'files'} onClick={() => onTabChange('files')} />
        <NavItem icon={<MdSettings />} label="Settings" isActive={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
      </nav>
    </div>
  );
};

const DesktopNavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
        isActive 
          ? 'bg-brand-light dark:bg-slate-800 text-brand-pink font-bold' 
          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-slate-800/50'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: isActive ? 'text-brand-pink' : ''
      })}
      <span className="text-[14px]">{label}</span>
    </button>
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
      className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 active:scale-95 transition-all relative"
    >
      <div 
        className={`flex items-center justify-center transition-all duration-300 ${
          isActive ? 'text-brand-pink' : 'text-[#9CA3AF]'
        }`}
      >
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 24,
          className: isActive ? 'drop-shadow-[0_0_2px_rgba(255,45,85,0.2)]' : ''
        })}
      </div>
      <span 
        className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${
          isActive ? 'text-brand-pink' : 'text-[#9CA3AF]'
        }`}
      >
        {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="navIndicator"
          className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-orange"
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
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all w-full text-left font-medium active:scale-[0.98] ${
        isActive 
          ? 'bg-[#FFF7F9] dark:bg-brand-pink/10 text-brand-pink' 
          : 'text-[#4B5563] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: isActive ? 'text-brand-pink' : 'text-[#6B7280] dark:text-gray-400'
      })}
      <span className="text-[15px]">{label}</span>
    </button>
  );
};

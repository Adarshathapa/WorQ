import React from 'react';
import { MdHome, MdApps, MdHistory, MdSettings, MdFolder } from 'react-icons/md';
import { motion } from 'motion/react';
import { TabType } from '../../types';
import { InstallPrompt } from './InstallPrompt';
import { useSettings } from '../../hooks/useSettings';
import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const { isDarkMode, toggleDarkMode } = useSettings();

  return (
    <div className="min-h-screen w-full bg-bg-light dark:bg-slate-950 flex flex-col relative transition-colors duration-300 pt-[64px] md:pt-[72px] pb-[64px] md:pb-0">
      <InstallPrompt />

      {/* Universal Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-[64px] md:h-[72px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#EEF0F5] dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-[32px] h-[32px] rounded-lg bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center">
            <span className="text-[18px] font-bold text-brand-pink">W</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[20px] font-bold text-[#111827] dark:text-white leading-none tracking-tight font-display mb-0.5 mt-[2px]">WorQ-Ai</h1>
            <p className="text-[11px] text-[#6B7280] dark:text-gray-400 font-medium leading-none">Efficient local file processing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <DesktopNavItem icon={<MdHome size={20} />} label="Home" isActive={activeTab === 'home'} onClick={() => onTabChange('home')} />
            <DesktopNavItem icon={<MdApps size={20} />} label="Tools" isActive={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
            <DesktopNavItem icon={<MdFolder size={20} />} label="Files" isActive={activeTab === 'files'} onClick={() => onTabChange('files')} />
            <DesktopNavItem icon={<MdSettings size={20} />} label="Settings" isActive={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
          </nav>

          <div className="flex items-center gap-2 ml-4">
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
            <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-[#E5E7EB] dark:border-slate-700 overflow-hidden active:scale-90 transition-transform">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Guest&backgroundColor=transparent" alt="User" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full relative">
        {children}
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

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { MdHome, MdApps, MdHistory, MdSettings, MdFolder } from 'react-icons/md';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from '../../types';
import { InstallPrompt } from './InstallPrompt';

interface LayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const diff = currentScrollY - lastScrollY;
    
    if (diff > 5) {
      // scroll down -> hide
      setIsNavVisible(false);
    } else if (diff < -5 || currentScrollY <= 10) {
      // scroll up -> show
      setIsNavVisible(true);
    }
    
    setLastScrollY(currentScrollY);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsNavVisible(true);
    }, 200);
  }, [lastScrollY]);

  // Handle active tab change to reset visibility
  useEffect(() => {
    setIsNavVisible(true);
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-bg-light dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      
      {/* Install Prompt Overlay */}
      <InstallPrompt />

      {/* Desktop Top Navigation */}
      <header className="hidden md:flex h-[72px] bg-white dark:bg-slate-900 border-b border-[#EEF0F5] dark:border-slate-800 items-center justify-between px-8 flex-shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-[32px] h-[32px] rounded-lg bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center">
            <span className="text-[18px] font-bold text-brand-pink">W</span>
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#111827] dark:text-white leading-none tracking-tight font-display mb-0.5 mt-[2px]">WorQ-Ai</h1>
            <p className="text-[11px] text-[#6B7280] dark:text-gray-400 font-medium leading-none">Efficient local file processing</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-8">
          <DesktopNavItem icon={<MdHome size={20} />} label="Home" isActive={activeTab === 'home'} onClick={() => onTabChange('home')} />
          <DesktopNavItem icon={<MdApps size={20} />} label="Tools" isActive={activeTab === 'tools'} onClick={() => onTabChange('tools')} />
          <DesktopNavItem icon={<MdFolder size={20} />} label="Files" isActive={activeTab === 'files'} onClick={() => onTabChange('files')} />
          <DesktopNavItem icon={<MdSettings size={20} />} label="Settings" isActive={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
        </nav>
      </header>

      {/* Main Content Area - Scrollable */}
      <main 
        id="main-content"
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar"
      >
        <div className="flex flex-col min-h-full">
          <div className="flex-1 w-full relative">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden h-[64px] bg-white dark:bg-slate-900 border-t border-[#EEF0F5] dark:border-slate-800 flex items-center justify-around px-2 pb-safe z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] flex-shrink-0">
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

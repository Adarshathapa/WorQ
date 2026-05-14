import React, { useState } from 'react';
import { Sparkles, Shield, Zap, ChevronRight, Play, ArrowRight, Star, CheckCircle2, Globe, Smartphone, Lock, UserCheck, Bot } from 'lucide-react';
import { TOOLS } from '../../constants';
import { ToolCard } from '../ui/ToolCard';
import { ToolItem } from '../../types';
import { Icon } from '../ui/Icon';

const QUICK_ACTIONS = [
  { id: 'merge-pdf', label: 'Merge', iconName: 'Combine' },
  { id: 'split-pdf', label: 'Split', iconName: 'Split' },
  { id: 'compress-pdf', label: 'Compress', iconName: 'Minimize2' },
  { id: 'signature-gen', label: 'Sign', iconName: 'PenLine' },
  { id: 'scan-to-pdf', label: 'Scan', iconName: 'ScanLine' },
  { id: 'remove-background', label: 'BG Remove', iconName: 'Eraser' },
  { id: 'crop-rotate-image', label: 'Editor', iconName: 'SlidersHorizontal' },
  { id: 'pdf-converter', label: 'Converter', iconName: 'ArrowRightLeft' },
];

const getQuickActionTheme = () => {
  // High-contrast orange theme for Quick Actions
  return {
    hoverBorder: 'hover:border-[#FF8A3D]/40',
    hoverBg: 'hover:bg-white',
    hoverShadow: 'hover:shadow-[0_12px_32px_rgba(255,138,61,0.15)]',
    iconBg: 'bg-orange-50 border border-orange-100',
    iconColor: 'text-[#FF8A3D] group-hover:text-white',
    iconHoverBg: 'group-hover:bg-gradient-to-br group-hover:from-[#FFA94D] group-hover:to-[#FF7A18] group-hover:border-[#FF8A3D]',
  };
};

const QuickActionCard: React.FC<{ toolId: string, iconName: string, label: string, onClick: () => void }> = ({ toolId, iconName, label, onClick }) => {
  const theme = getQuickActionTheme();

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center sm:justify-start gap-2.5 sm:gap-3 p-3 sm:p-4 w-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${theme.hoverBorder} hover:bg-gray-50/50 hover:shadow-[0_8px_24px_rgba(255,138,61,0.08)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-orange-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] flex items-center justify-center bg-orange-50/50 border border-orange-100/50 text-[#FF8A3D] group-hover:bg-[#FF8A3D] group-hover:text-white transition-all duration-300 shadow-sm relative overflow-hidden shrink-0 group-hover:shadow-[0_4px_12px_rgba(255,138,61,0.2)]`}>
        <Icon name={iconName} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </div>
      <span className="text-[12px] sm:text-[14px] font-semibold text-[#111827] group-hover:text-gray-900 leading-tight transition-colors antialiased tracking-tight mt-1 sm:mt-0 text-center sm:text-left">
        {label}
      </span>
    </button>
  );
};

const Section: React.FC<{ title: string, subtitle: string, tools: ToolItem[], onToolClick: (tool: ToolItem) => void, onSeeAll: () => void, iconContainerColor?: string, IconComponent?: React.ReactNode }> = ({ title, subtitle, tools, onToolClick, onSeeAll, iconContainerColor = "bg-[#FF8A3D] text-white shadow-orange-500/30", IconComponent }) => {
  if (tools.length === 0) return null;
  return (
    <div className="mb-4 w-full relative group/section xl:flex xl:items-start xl:gap-8">
      
      {/* Section Header Left */}
      <div className="xl:sticky xl:top-[90px] xl:w-[260px] xl:shrink-0 flex flex-col mb-6 xl:mb-0 relative z-10 pt-2">
        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-white/20 mb-5 ${iconContainerColor}`}>
           {IconComponent || <div className="w-6 h-6 bg-white/20 rounded-lg"></div>}
        </div>
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#111827] font-display tracking-tight mb-2 leading-tight">
          {title}
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#6B7280] font-medium leading-[1.5] mb-6 xl:mb-8 max-w-sm xl:max-w-none">
          {subtitle}
        </p>
        <button onClick={onSeeAll} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#FF8A3D] hover:text-[#FF7A18] transition-colors group">
          Explore all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-5 flex-1 w-full relative z-10">
        {tools.slice(0, 6).map(tool => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onClick={() => onToolClick(tool)} 
          />
        ))}
      </div>
    </div>
  );
};

export const HomeView: React.FC<{ onToolClick: (tool: ToolItem) => void }> = ({ onToolClick }) => {

  const pdfTools = TOOLS.filter(t => t.category === 'pdf');
  const imageTools = TOOLS.filter(t => t.category === 'image');
  const conversionTools = TOOLS.filter(t => t.category === 'conversion');
  const scannerTools = TOOLS.filter(t => t.category === 'scan_files');
  const aiTools = TOOLS.filter(t => t.category === 'ai_tools');

  const [activeSearchTab, setActiveSearchTab] = useState(0);

  const searchTabs = [
    { name: 'Search', icon: 'Search', placeholder: 'Search anything or paste a URL...' },
    { name: 'Tools', icon: 'LayoutGrid', placeholder: 'Search for any tool, like "PDF Merge"...' },
    { name: 'Files', icon: 'Files', placeholder: 'Upload or search your files...' },
  ];

  return (
    <div className="flex flex-col w-full relative">
      
      {/* Hero Section */}
      <section className="relative w-full pt-20 md:pt-32 pb-16 md:pb-28 overflow-hidden bg-white">
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-gradient-to-br from-orange-100/40 via-[#FF8A3D]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[70%] bg-gradient-to-bl from-purple-100/40 via-blue-100/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[60%] bg-gradient-to-tr from-rose-50/40 via-[#FF8A3D]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center justify-center max-w-[1200px] mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8 text-center pt-8 md:pt-12">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 mb-8 bg-orange-50/80 backdrop-blur-md border border-orange-200/50 shadow-sm px-4 py-1.5 rounded-full hover:bg-orange-50 transition-colors cursor-pointer group">
             <div className="flex items-center justify-center">
               <Sparkles size={14} className="text-[#FF8A3D]" />
             </div>
             <span className="text-[13px] font-semibold text-orange-900/80">The All-in-One AI Productivity Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[44px] sm:text-[64px] lg:text-[88px] font-black font-display leading-[0.95] tracking-tighter text-[#111827] mb-6 max-w-[1000px]">
            Everything You Need.<br />
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#F97316]">AI.</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-[18px] sm:text-[22px] text-[#4B5563] mb-12 font-medium leading-[1.5] max-w-[640px]">
            WorQ-AI is your supercharged AI workspace.<br className="hidden sm:block"/>
            Create, convert, analyze, and automate anything in seconds.
          </p>

          {/* --- SEARCH TAB UI --- */}
          <div className="w-full max-w-[840px] mx-auto mb-10">
            {/* Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {searchTabs.map((tab, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveSearchTab(i)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all ${activeSearchTab === i ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-100'}`}
                >
                  <Icon name={tab.icon} className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Premium Search Input */}
            <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-3 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.12)] border border-gray-200/50 flex flex-col sm:flex-row items-center gap-3 relative transition-all focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:bg-white focus-within:shadow-xl">
               <div className="flex-1 w-full bg-transparent px-3 sm:px-5 py-3 flex items-center pr-4">
                  <Icon name="Search" className="w-6 h-6 text-gray-400 mr-4 shrink-0" />
                  <input 
                    type="text" 
                    className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 font-medium text-[16px] sm:text-[18px]" 
                    placeholder={searchTabs[activeSearchTab].placeholder} 
                  />
               </div>
               
               <button onClick={() => onToolClick({id: 'all-tools'} as any)} className="w-full sm:w-auto h-[52px] px-8 bg-gradient-to-r from-[#FF8A3D] to-[#F97316] hover:to-[#FF8A3D] text-white rounded-[1.25rem] font-bold shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 group mt-2 sm:mt-0 shrink-0">
                 Search
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>

          {/* Quick Action Pills Under Search */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-20 max-w-[800px] mx-auto">
             {['Compress PDF', 'Generate Report', 'AI Image', 'Translate'].map((item, i) => (
               <button 
                 key={i} 
                 onClick={() => {
                   if (item === 'Compress PDF') {
                     onToolClick({id: 'compress-pdf', category: 'pdf', name: 'Compress PDF'} as any);
                   } else if (item === 'AI Image') {
                     onToolClick({id: 'image-generator', category: 'image', name: 'Image Generator'} as any);
                   } else {
                     onToolClick({id: 'all-tools'} as any);
                   }
                 }}
                 className="bg-white/60 hover:bg-white backdrop-blur-md border border-gray-200/60 shadow-sm text-gray-600 font-medium text-[13px] px-4 py-2 rounded-full flex items-center gap-2 hover:shadow-md hover:text-gray-900 transition-all active:scale-95"
               >
                 <Icon name={['FileText', 'FileBarChart', 'Image', 'Languages'][i]} className="w-3.5 h-3.5 text-[#FF8A3D]" />
                 {item}
               </button>
             ))}
          </div>
          
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="w-full mb-16 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
        <div className="flex flex-col mb-10 text-center sm:text-left gap-4">
           {/* Badge Header */}
           <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="bg-[#FFF4ED] text-[#FF8A3D] font-bold text-[12px] sm:text-[13px] px-3 py-1 rounded-full tracking-wider uppercase inline-flex items-center shadow-sm border border-[#FFE4D6]">
                <Icon name="Zap" className="w-3.5 h-3.5 mr-1" /> All-in-One Toolkit
              </span>
           </div>
           
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
             <div>
               <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-black text-[#111827] font-display tracking-tight mb-2 leading-tight">
                 Powerful Tools for <span className="text-[#FF8A3D]">Every</span> Task
               </h2>
               <p className="text-[#6B7280] font-medium text-[16px] sm:text-[18px]">
                 Everything you need to work smarter, faster, and better.
               </p>
             </div>
              <div className="flex flex-wrap items-center gap-2">
               {/* Minimal Pills */}
               <button onClick={() => onToolClick({id: 'all-tools'} as any)} className="bg-[#FF8A3D] text-white border border-[#FF8A3D] px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all hover:bg-[#E8762D]">All Tools</button>
               <button onClick={() => onToolClick({id: 'all-tools', category: 'pdf'} as any)} className="bg-white text-gray-500 border border-gray-200 px-6 py-2.5 rounded-full text-[14px] font-medium hover:text-gray-900 transition-all shadow-sm">PDF Tools</button>
               <button onClick={() => onToolClick({id: 'all-tools', category: 'image'} as any)} className="bg-white text-gray-500 border border-gray-200 px-6 py-2.5 rounded-full text-[14px] font-medium hover:text-gray-900 transition-all shadow-sm">Image Tools</button>
               <button onClick={() => onToolClick({id: 'all-tools', category: 'conversion'} as any)} className="bg-white text-gray-500 border border-gray-200 px-6 py-2.5 rounded-full text-[14px] font-medium hover:text-gray-900 transition-all shadow-sm">Text Tools</button>
               <button onClick={() => onToolClick({id: 'all-tools', category: 'ai_tools'} as any)} className="bg-white text-gray-500 border border-gray-200 px-6 py-2.5 rounded-full text-[14px] font-medium hover:text-gray-900 transition-all shadow-sm">AI Tools</button>
             </div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {QUICK_ACTIONS.map((action) => {
             if (action.id === 'scan-to-pdf') {
               return (
                 <div key={action.id} className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[180px] hover:border-gray-300 transition-colors cursor-default">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 mb-3">
                     <span className="text-2xl leading-none">+</span>
                   </div>
                   <h3 className="text-[15px] font-bold text-gray-600 mb-1">New Tool Coming</h3>
                   <span className="text-[13px] text-gray-400">Placeholder for tool card</span>
                 </div>
               );
             }
             return (
             <div 
               key={action.id} 
               onClick={() => {
                  const tool = TOOLS.find(t => t.id === action.id);
                  if (tool) onToolClick(tool);
               }}
               className="bg-gradient-to-br from-[#FF8A3D] to-[#E8762D] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(255,138,61,0.15)] hover:shadow-[0_20px_60px_rgba(255,138,61,0.25)] transition-all duration-500 hover:-translate-y-1 relative group cursor-pointer overflow-hidden flex flex-col h-full"
             >
                {/* Animated Background Lines */}
                <div 
                  className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+CjxwYXRoIGQ9Ik0wIDE2TDE2IDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] pointer-events-none group-hover:-translate-y-4 group-hover:translate-x-4 transition-transform duration-1000 ease-out" 
                  style={{ backgroundSize: '16px 16px' }} 
                />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />

                <div className="flex items-center gap-3 mb-4 relative z-10 w-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/20 border border-white/30 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon name={action.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="text-[17px] font-bold text-white leading-tight">
                    {action.label}
                  </h3>
                </div>
                
                <p className="text-[14px] text-white/90 font-medium leading-[1.5] mb-6 flex-1 relative z-10">
                   Enhance your workflow with AI-powered {action.label.toLowerCase()} capabilities designed for modern teams.
                </p>

                <div className="flex items-center justify-between w-full mt-auto relative z-10">
                   <div className="flex items-center gap-1.5 opacity-90">
                     <span className="text-[11px] font-semibold bg-white/20 border border-white/20 px-2 py-0.5 rounded text-white/90 shadow-sm">Fast</span>
                     <span className="text-[11px] font-semibold bg-white/20 border border-white/20 px-2 py-0.5 rounded text-white/90 shadow-sm">Secure</span>
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#FF8A3D] text-white transition-all shadow-sm">
                     <ArrowRight size={14} className="group-hover:-rotate-45 transition-transform duration-300" />
                   </div>
                </div>
             </div>
             );
          })}
        </div>
        
        <div className="flex justify-center mt-12 w-full">
           <button onClick={() => onToolClick({id: 'all-tools'} as any)} className="bg-white border border-gray-200 shadow-sm text-[#111827] font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2">
             View All Tools <ArrowRight size={14} className="-rotate-45" />
           </button>
        </div>
      </section>

      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Structured Sections */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <Section 
            title="PDF Utilities" 
            subtitle="Essential tools to work smarter with PDF documents." 
            tools={pdfTools} 
            onToolClick={onToolClick} 
            onSeeAll={() => onToolClick({id: 'all-tools', category: 'pdf'} as any)} 
            iconContainerColor="bg-[#FF6B6B] text-white shadow-red-500/20"
            IconComponent={<Icon name="FileText" className="w-7 h-7" />}
          />
          
          <Section 
             title="Image Management" 
             subtitle="Edit, enhance and optimize images effortlessly." 
             tools={imageTools} 
             onToolClick={onToolClick} 
             onSeeAll={() => onToolClick({id: 'all-tools', category: 'image'} as any)} 
             iconContainerColor="bg-indigo-500 text-white shadow-indigo-500/20"
             IconComponent={<Icon name="Image" className="w-7 h-7" />}
          />

          <Section 
             title="Fast Conversion" 
             subtitle="Convert files to any format you need instantly." 
             tools={conversionTools} 
             onToolClick={onToolClick} 
             onSeeAll={() => onToolClick({id: 'all-tools', category: 'conversion'} as any)} 
             iconContainerColor="bg-blue-500 text-white shadow-blue-500/20"
             IconComponent={<Icon name="ArrowRightLeft" className="w-7 h-7" />}
          />

          <Section 
             title="AI Tools" 
             subtitle="Smart AI tools to simplify complex tasks." 
             tools={aiTools} 
             onToolClick={onToolClick} 
             onSeeAll={() => onToolClick({id: 'all-tools', category: 'ai_tools'} as any)} 
             iconContainerColor="bg-fuchsia-500 text-white shadow-fuchsia-500/20"
             IconComponent={<Icon name="WandSparkles" className="w-7 h-7" />}
          />
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="w-full py-20 sm:py-28 bg-[#FAFAFB] border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
            <span className="bg-white text-[#FF8A3D] font-bold text-[13px] sm:text-[14px] px-5 py-2.5 rounded-full tracking-wider uppercase mb-5 inline-flex items-center shadow-sm border border-gray-100">Why WorQ-AI</span>
            <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-black text-[#111827] font-display tracking-tight leading-[1.1] mb-6">
              Built for Speed, Privacy &<br className="hidden md:block"/> Productivity
            </h2>
            <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#4B5563] font-medium max-w-[600px] leading-relaxed">
              Professional AI-powered tools designed for modern workflows across all devices.
            </p>
          </div>
          
          {/* Feature Cards Grid Container */}
          <div className="flex flex-col gap-6 sm:gap-8 max-w-[1200px] mx-auto mb-16 relative">
            
            {/* Top Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 sm:p-10 rounded-[2rem] ring-1 ring-gray-900/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:ring-gray-900/10 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-transparent group-hover:from-orange-50/60 transition-colors duration-500" />
                <div className="w-full flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 ring-1 ring-orange-100 group-hover:scale-110 group-hover:bg-[#FF8A3D] group-hover:text-white group-hover:ring-[#FF8A3D] transition-all duration-500 shadow-sm">
                    <Globe size={24} strokeWidth={1.5} />
                  </div>
                  <div className="text-[13px] font-mono tracking-widest font-semibold text-gray-300 group-hover:text-orange-400 transition-colors duration-500">01</div>
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="font-bold text-gray-900 text-xl mb-3 tracking-tight">100% Browser Based</h4>
                  <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed font-medium">No installs or heavy software required. Open instantly and work directly from your browser.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 sm:p-10 rounded-[2rem] ring-1 ring-gray-900/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:ring-gray-900/10 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-transparent group-hover:from-indigo-50/60 transition-colors duration-500" />
                <div className="w-full flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 ring-1 ring-indigo-100 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white group-hover:ring-indigo-500 transition-all duration-500 shadow-sm">
                    <Bot size={24} strokeWidth={1.5} />
                  </div>
                  <div className="text-[13px] font-mono tracking-widest font-semibold text-gray-300 group-hover:text-indigo-400 transition-colors duration-500">02</div>
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="font-bold text-gray-900 text-xl mb-3 tracking-tight">AI Powered</h4>
                  <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed font-medium">Advanced AI algorithms deliver faster processing, smarter optimization, and better results.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 sm:p-10 rounded-[2rem] ring-1 ring-gray-900/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:ring-gray-900/10 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-transparent group-hover:from-emerald-50/60 transition-colors duration-500" />
                <div className="w-full flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 ring-1 ring-emerald-100 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-500 transition-all duration-500 shadow-sm">
                    <Shield size={24} strokeWidth={1.5} />
                  </div>
                  <div className="text-[13px] font-mono tracking-widest font-semibold text-gray-300 group-hover:text-emerald-400 transition-colors duration-500">03</div>
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="font-bold text-gray-900 text-xl mb-3 tracking-tight">Secure Processing</h4>
                  <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed font-medium">Your files remain private with secure browser-based local processing and encryption.</p>
                </div>
              </div>
            </div>

            {/* Bottom Row Cards (Centered) */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:w-[85%] mx-auto">
              {/* Feature 4 */}
              <div className="bg-white p-8 sm:p-10 rounded-[2rem] ring-1 ring-gray-900/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:ring-gray-900/10 transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center text-left gap-6 sm:gap-8 relative overflow-hidden group md:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 to-transparent group-hover:from-rose-50/60 transition-colors duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 ring-1 ring-rose-100 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white group-hover:ring-rose-500 transition-all duration-500 relative z-10 shadow-sm mt-1 sm:mt-0">
                  <Zap size={28} strokeWidth={1.5} />
                </div>
                <div className="relative z-10 flex-1">
                   <div className="flex items-center justify-between gap-4 mb-2">
                     <h4 className="font-bold text-gray-900 text-xl tracking-tight">Lightning Fast</h4>
                     <span className="text-[13px] font-mono tracking-widest font-semibold text-gray-300 group-hover:text-rose-400 transition-colors duration-500">04</span>
                   </div>
                  <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed font-medium">Optimized for maximum speed with smooth performance across all modern devices.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Stats Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 bg-white text-[#FF8A3D] rounded-[2rem] sm:rounded-full py-8 px-10 sm:px-14 shadow-xl border border-orange-100 max-w-[1000px] mx-auto w-full text-center md:text-left relative overflow-hidden">
            {/* Glass shine effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
            <div className="absolute bottom-0 left-[20%] right-[20%] h-[100px] bg-orange-50 blur-3xl" />

            <div className="flex flex-col items-center md:items-start relative z-10">
               <span className="font-black text-[#FF8A3D] text-[32px] sm:text-[40px] tracking-tight leading-none mb-1">50K+</span>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-pulse" />
                 <span className="text-[14px] sm:text-[15px] text-gray-500 font-medium tracking-wide uppercase">Happy Users</span>
               </div>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-gray-200 relative z-10" />

            <div className="flex flex-col items-center md:items-start relative z-10">
               <span className="font-black text-[#FF8A3D] text-[32px] sm:text-[40px] tracking-tight leading-none mb-1">100%</span>
               <div className="flex items-center gap-2">
                 <Shield size={14} className="text-[#10B981]" strokeWidth={2.5} />
                 <span className="text-[14px] sm:text-[15px] text-gray-500 font-medium tracking-wide uppercase">Private & Secure</span>
               </div>
            </div>

            <div className="hidden md:block w-px h-16 bg-gray-200 relative z-10" />

            <div className="flex flex-col items-center md:items-start relative z-10">
               <span className="font-black text-[#FF8A3D] text-[32px] sm:text-[40px] tracking-tight leading-none mb-1">99.9%</span>
               <div className="flex items-center gap-2">
                 <Icon name="Rocket" className="w-4 h-4 text-[#3B82F6]" />
                 <span className="text-[14px] sm:text-[15px] text-gray-500 font-medium tracking-wide uppercase">Uptime Server</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full mb-28 sm:mb-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto relative mt-16 sm:mt-20">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] bg-orange-100/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col items-center mb-16 sm:mb-20 text-center relative z-10">
          <span className="bg-[#FFF4ED] text-[#FF8A3D] font-bold text-[13px] sm:text-[14px] px-5 py-2.5 rounded-full tracking-wider uppercase mb-5 inline-flex items-center shadow-sm border border-[#FFE4D6]">Trusted Worldwide</span>
          <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-black text-[#111827] font-display tracking-tight leading-[1.1] mb-6">
            Loved by Creators, <br className="hidden sm:block"/>Students & Professionals
          </h2>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#4B5563] font-medium max-w-[600px] leading-relaxed">
            Thousands of users rely on WorQ-AI every day for fast and secure file processing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col gap-6 relative transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <Icon name="Quote" className="w-10 h-10 text-[#FF8A3D]/20 drop-shadow-sm" />
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
              </div>
            </div>
            
            <p className="text-[17px] sm:text-[19px] text-[#111827] font-bold leading-[1.6] relative z-10 my-4 flex-1">
              &quot;WorQ-AI has completely changed the way I handle PDF and image tasks. Super fast and incredibly easy to use! It saves me hours every week.&quot;
            </p>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto relative z-10 w-full">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="font-black text-[#111827] text-[16px] tracking-tight">Sarah Johnson</h5>
                  <span className="text-[14px] text-[#6B7280] font-medium block">Product Designer</span>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full" title="Verified User">
                <CheckCircle2 size={16} strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col gap-6 relative transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-50/50 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <Icon name="Quote" className="w-10 h-10 text-purple-400/20 drop-shadow-sm" />
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
              </div>
            </div>
            
            <p className="text-[17px] sm:text-[19px] text-[#111827] font-bold leading-[1.6] relative z-10 my-4 flex-1">
               &quot;The AI tools are amazing! Background remover and OCR are my daily go-to features. It's like having a professional suite right in my browser.&quot;
            </p>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto relative z-10 w-full">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                   <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <h5 className="font-black text-[#111827] text-[16px] tracking-tight">Michael Chen</h5>
                   <span className="text-[14px] text-[#6B7280] font-medium block">Marketing Manager</span>
                 </div>
               </div>
               <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full" title="Verified User">
                 <CheckCircle2 size={16} strokeWidth={2.5} />
               </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col gap-6 relative transition-all duration-500 overflow-hidden lg:col-span-2 xl:col-span-1 lg:max-w-2xl lg:mx-auto xl:max-w-none">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-50/50 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <Icon name="Quote" className="w-10 h-10 text-emerald-400/20 drop-shadow-sm" />
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
                <Star size={14} className="text-[#FF8A3D] fill-current" />
              </div>
            </div>
            
            <p className="text-[17px] sm:text-[19px] text-[#111827] font-bold leading-[1.6] relative z-10 my-4 flex-1">
               &quot;Secure, reliable, and works right in the browser without uploading my sensitive documents. WorQ-AI is now my essential productivity toolbox.&quot;
            </p>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto relative z-10 w-full">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                   <img src="https://i.pravatar.cc/150?img=9" alt="User" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <h5 className="font-black text-[#111827] text-[16px] tracking-tight">Priya Sharma</h5>
                   <span className="text-[14px] text-[#6B7280] font-medium block">Freelance Consultant</span>
                 </div>
               </div>
               <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full" title="Verified User">
                 <CheckCircle2 size={16} strokeWidth={2.5} />
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

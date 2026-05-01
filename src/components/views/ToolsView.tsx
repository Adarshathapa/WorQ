import React, { useState, useEffect } from 'react';
import { TOOLS } from '../../constants';
import { ToolCard } from '../ui/ToolCard';
import { ToolItem } from '../../types';
import { AdPlaceholder } from '../ui/AdPlaceholder';
import { SEO } from '../ui/SEO';

type CategoryFilter = 'all' | 'pdf' | 'image' | 'conversion' | 'scan_files';

interface ToolsViewProps {
  onToolClick: (tool: ToolItem) => void;
  defaultCategory?: string | null;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onToolClick, defaultCategory }) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>((defaultCategory as CategoryFilter) || 'all');

  useEffect(() => {
    if (defaultCategory) {
      setActiveFilter(defaultCategory as CategoryFilter);
    } else {
      setActiveFilter('all');
    }
  }, [defaultCategory]);

  const handleFilterClick = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    // Update URL without reloading page
    let path = '/tools';
    if (filter === 'pdf') path = '/pdf-tools';
    if (filter === 'image') path = '/image-tools';
    if (filter === 'conversion') path = '/conversion-tools';
    if (filter === 'scan_files') path = '/scanning-tools';
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  const filteredTools = TOOLS.filter(
    tool => activeFilter === 'all' || tool.category === activeFilter
  );

  const getSeoDetails = () => {
    switch (activeFilter) {
      case 'pdf': return { title: 'Free PDF Tools', desc: 'A vast collection of free PDF tools to merge, compress, edit and convert PDFs.'};
      case 'image': return { title: 'Free Image Tools', desc: 'Powerful online tools to compress, resize, edit and convert your images.'};
      case 'conversion': return { title: 'Free Conversion Tools', desc: 'Convert your PDFs, Images and other documents from one format to another online for free.'};
      case 'scan_files': return { title: 'Free Document Scanning Tools', desc: 'Scan and digitize your documents instantly using our free scanning tools.'};
      default: return { title: 'All Free Tools', desc: 'Explore all our free PDF, Image, and Document Conversion tools.' };
    }
  };
  const seoDetails = getSeoDetails();

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto p-4 md:p-8 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400 bg-bg-base dark:bg-slate-950">
      <SEO title={seoDetails.title} description={seoDetails.desc} />
      <div className="px-1 mt-1">
        <h1 className="text-[24px] md:text-[32px] font-bold text-brand-gradient font-display tracking-tight leading-none">
          {activeFilter === 'all' && 'All Toolbox'}
          {activeFilter === 'pdf' && 'PDF Tools'}
          {activeFilter === 'image' && 'Image Tools'}
          {activeFilter === 'conversion' && 'Conversion Tools'}
          {activeFilter === 'scan_files' && 'Scanning Tools'}
        </h1>
        <p className="text-[#6B7280] dark:text-gray-500 font-medium text-[13px] md:text-[15px] mt-1.5">Pick a tool to simplify your task.</p>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {(['all', 'pdf', 'image', 'conversion', 'scan_files'] as CategoryFilter[]).map((filter) => (
          <FilterChip 
            key={filter}
            label={filter.replace('_', ' & ').toUpperCase()} 
            isActive={activeFilter === filter} 
            onClick={() => handleFilterClick(filter)} 
          />
        ))}
      </div>

      <div className="px-1 w-full max-w-[1000px] mx-auto">
        <AdPlaceholder id={3} />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        {filteredTools.map(tool => (
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

const FilterChip: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-95 border ${
        isActive 
          ? 'bg-brand-pink border-brand-pink text-white shadow-md' 
          : 'bg-white dark:bg-slate-800 border-[#E5E7EB] dark:border-slate-700 text-[#6B7280]'
      }`}
    >
      {label}
    </button>
  );
};


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { HomeView } from './components/views/HomeView';
import { ToolsView } from './components/views/ToolsView';
import { FileManagerView } from './components/views/FileManagerView';
import { SettingsView } from './components/views/SettingsView';
import { ToolExecutionView } from './components/views/ToolExecutionView';
import { BlogpostView } from './components/views/BlogpostView';
import { TabType, ToolItem } from './types';
import { useSettings } from './hooks/useSettings';
import { SEO } from './components/ui/SEO';
import { TOOLS } from './constants';

const parseRoute = () => {
    const p = window.location.pathname;
    let tab: TabType = 'home';
    let tool: ToolItem | null = null;
    let category: string | null = null;

    if (p.startsWith('/blog/')) {
        tab = 'blog';
    } else if (p === '/file-manager') {
        tab = 'files';
    } else if (p === '/settings') {
        tab = 'settings';
    } else if (p === '/pdf-tools') {
        tab = 'tools';
        category = 'pdf';
    } else if (p === '/image-tools') {
        tab = 'tools';
        category = 'image';
    } else if (p === '/conversion-tools') {
        tab = 'tools';
        category = 'conversion';
    } else if (p === '/scanning-tools') {
        tab = 'tools';
        category = 'scan_files';
    } else if (p === '/tools') {
        tab = 'tools';
    } else if (p.startsWith('/pdf-tools/') || p.startsWith('/image-tools/') || p.startsWith('/conversion-tools/') || p.startsWith('/scanning-tools/')) {
        const id = p.split('/').pop();
        const found = TOOLS.find(t => t.id === id);
        if (found) {
            tool = found;
        } else {
            tab = 'home';
        }
    }
    
    return { tab, tool, category };
};

export default function App() {
  const { isDarkMode } = useSettings();
  
  const parsedValue = parseRoute();
  const [activeTab, setActiveTab] = useState<TabType>(parsedValue.tab);
  const [activeTool, setActiveTool] = useState<ToolItem | null>(parsedValue.tool);
  const [activeCategory, setActiveCategory] = useState<string | null>(parsedValue.category);

  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRoute();
      setActiveTab(parsed.tab);
      setActiveTool(parsed.tool);
      setActiveCategory(parsed.category);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
       window.history.pushState({}, '', path);
       window.dispatchEvent(new Event('popstate'));
    }
  };

  const handleTabChange = (tab: TabType) => {
     if (tab === 'home') navigate('/');
     else if (tab === 'tools') navigate('/pdf-tools'); 
     else if (tab === 'files') navigate('/file-manager');
     else if (tab === 'settings') navigate('/settings');
  };

  const handleToolClick = (tool: ToolItem) => {
    if (tool.id === 'my-files') {
      navigate('/file-manager');
    } else if (tool.id === 'all-tools') {
      navigate('/pdf-tools');
    } else {
       let categorySlug = 'pdf-tools';
       if (tool.category === 'image') categorySlug = 'image-tools';
       else if (tool.category === 'conversion') categorySlug = 'conversion-tools';
       else if (tool.category === 'scan_files') categorySlug = 'scanning-tools';
       navigate(`/${categorySlug}/${tool.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex justify-center w-full transition-colors duration-300">
      <SEO />
      <Layout activeTab={activeTab} onTabChange={handleTabChange}>
        {activeTool ? (
          <ToolExecutionView 
            tool={activeTool} 
            onBack={() => {
               let categorySlug = 'pdf-tools';
               if (activeTool.category === 'image') categorySlug = 'image-tools';
               else if (activeTool.category === 'conversion') categorySlug = 'conversion-tools';
               else if (activeTool.category === 'scan_files') categorySlug = 'scanning-tools';
               navigate(`/${categorySlug}`);
            }} 
            onToolSelect={handleToolClick} 
          />
        ) : (
          <>
            {activeTab === 'home' && <HomeView onToolClick={handleToolClick} />}
            {activeTab === 'tools' && <ToolsView onToolClick={handleToolClick} defaultCategory={activeCategory} />}
            {activeTab === 'files' && <FileManagerView />}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'blog' && (
              <BlogpostView 
                onBack={() => {
                  navigate('/');
                }} 
              />
            )}
          </>
        )}
      </Layout>
    </div>
  );
}

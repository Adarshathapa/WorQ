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
import { BlogListView } from './components/views/BlogListView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { TermsOfServiceView } from './components/views/TermsOfServiceView';
import { SecurityView } from './components/views/SecurityView';
import { AboutUsView } from './components/views/AboutUsView';
import { TabType, ToolItem } from './types';
import { useSettings } from './hooks/useSettings';
import { useScrollManagement } from './hooks/useScrollManagement';
import { SEO } from './components/ui/SEO';
import { TOOLS } from './constants';

const parseRoute = () => {
    let p = window.location.pathname;
    if (p !== '/' && p.endsWith('/')) {
        p = p.slice(0, -1);
    }
    let tab: TabType = 'home';
    let tool: ToolItem | null = null;
    let category: string | null = null;

    if (p === '/blogs') {
        tab = 'blogs';
    } else if (p.startsWith('/blog/')) {
        tab = 'blog';
    } else if (p === '/privacy-policy') {
        tab = 'privacy';
    } else if (p === '/terms-of-service') {
        tab = 'terms';
    } else if (p === '/security') {
        tab = 'security';
    } else if (p === '/about-us') {
        tab = 'about';
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
    } else if (p === '/ai-tools') {
        tab = 'tools';
        category = 'ai_tools';
    } else if (p === '/tools') {
        tab = 'tools';
    } else if (p.startsWith('/pdf-tools/') || p.startsWith('/image-tools/') || p.startsWith('/conversion-tools/') || p.startsWith('/scanning-tools/') || p.startsWith('/ai-tools/')) {
        const id = p.split('/').pop();
        const found = TOOLS.find(t => t.id === id);
        if (found) {
            tool = found;
        } else {
            tab = 'home';
        }
    } else if (p.length > 1) {
        const id = p.slice(1);
        const found = TOOLS.find(t => t.id === id);
        if (found) {
            tool = found;
        }
    }
    
    return { tab, tool, category };
};

export default function App() {
  useScrollManagement();
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
       window.history.pushState({ scrollPos: 0 }, '', path);
       window.dispatchEvent(new PopStateEvent('popstate', { state: { scrollPos: 0 } }));
    }
  };

  const handleTabChange = (tab: TabType) => {
     if (tab === 'home') navigate('/');
     else if (tab === 'tools') navigate('/pdf-tools'); 
     else if (tab === 'files') navigate('/file-manager');
     else if (tab === 'settings') navigate('/settings');
     else if (tab === 'blogs') navigate('/blogs');
     else if (tab === 'blog') navigate('/blog/1');
  };

  const handleToolClick = (tool: ToolItem) => {
    if (tool.id === 'my-files') {
      navigate('/file-manager');
    } else if (tool.id === 'all-tools') {
       let categorySlug = 'pdf-tools';
       if (tool.category === 'image') categorySlug = 'image-tools';
       else if (tool.category === 'conversion') categorySlug = 'conversion-tools';
       else if (tool.category === 'scan_files') categorySlug = 'scanning-tools';
       else if (tool.category === 'ai_tools') categorySlug = 'ai-tools';
       navigate(`/${categorySlug}`);
    } else {
       if (['merge-pdf', 'compress-pdf', 'jpg-to-pdf'].includes(tool.id)) {
           navigate(`/${tool.id}`);
       } else {
           let categorySlug = 'pdf-tools';
           if (tool.category === 'image') categorySlug = 'image-tools';
           else if (tool.category === 'conversion') categorySlug = 'conversion-tools';
           else if (tool.category === 'scan_files') categorySlug = 'scanning-tools';
           else if (tool.category === 'ai_tools') categorySlug = 'ai-tools';
           navigate(`/${categorySlug}/${tool.id}`);
       }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-slate-900 flex justify-center w-full transition-colors duration-300">
      <SEO />
      <Layout activeTab={activeTab} onTabChange={handleTabChange}>
        {activeTool ? (
          <ToolExecutionView 
            tool={activeTool} 
            onBack={() => {
               navigate('/');
            }} 
            onToolSelect={handleToolClick} 
          />
        ) : (
          <>
            {activeTab === 'home' && <HomeView onToolClick={handleToolClick} />}
            {activeTab === 'tools' && <ToolsView onToolClick={handleToolClick} defaultCategory={activeCategory} />}
            {activeTab === 'files' && <FileManagerView />}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'blogs' && (
              <BlogListView 
                onBack={() => navigate('/')} 
                onBlogClick={(slug) => navigate(`/blog/${slug}`)} 
              />
            )}
            {activeTab === 'blog' && (
              <BlogpostView 
                onBack={() => {
                  navigate('/blogs');
                }} 
              />
            )}
            {activeTab === 'privacy' && <PrivacyPolicyView onBack={() => navigate('/')} />}
            {activeTab === 'terms' && <TermsOfServiceView onBack={() => navigate('/')} />}
            {activeTab === 'security' && <SecurityView onBack={() => navigate('/')} />}
            {activeTab === 'about' && <AboutUsView onBack={() => navigate('/')} />}
          </>
        )}
      </Layout>
    </div>
  );
}

export type TabType = 'home' | 'tools' | 'files' | 'settings' | 'blog' | 'blogs' | 'privacy' | 'terms' | 'security' | 'about';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'pdf' | 'image' | 'conversion' | 'scan_files' | 'ai_tools';
  status?: 'active' | 'soon';
  color?: string;
  badges?: string[];
}

export interface FileItem {
  id: string;
  name: string;
  toolName: string;
  size: number;
  date: number;
  type: string;
}



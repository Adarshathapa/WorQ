import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  showContainer?: boolean;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  className = '',
  showContainer = false 
}) => {
  const MappedIcon = (LucideIcons as any)[name] || LucideIcons.Folder;
  
  if (showContainer) {
    return (
      <div className={`flex items-center justify-center rounded-[18px] bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-gray-700 w-12 h-12 lg:w-[60px] lg:h-[60px] ${className}`}>
        <MappedIcon
          strokeWidth={2.2}
          className="w-5 h-5 lg:w-7 lg:h-7"
        />
      </div>
    );
  }

  return <MappedIcon size={size} className={className} strokeWidth={2.2} />;
};


import React from 'react';
import { 
  Combine,
  Minimize2,
  Scissors,
  RotateCw,
  Wand2,
  Image,
  Maximize2,
  Crop,
  FileText,
  FileDigit,
  Languages,
  Scan,
  Folder,
  PenTool,
  Grid,
  FileEdit,
  ArrowRightLeft,
  FileUp,
  FileDown,
  FileOutput,
  FileInput,
  FileCheck,
  FileSignature,
  Stamp,
  Camera
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  fill?: string;
  showContainer?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  'merge-pdf': Combine,
  'compress-pdf': Minimize2,
  'split-pdf': Scissors,
  'rotate-pdf': RotateCw,
  'magic': Wand2,
  'compress-image': Image,
  'resize-image': Maximize2,
  'crop': Crop,
  'pdf-doc': FileEdit,
  'doc-pdf': FileCheck,
  'text-ocr': Languages,
  'text-pdf': FileText,
  'camera': Camera,
  'scan': Scan,
  'folder': Folder,
  'edit-pdf': PenTool,
  'grid': Grid,
  'watermark-pdf': Stamp,
  'pdf-converter': ArrowRightLeft,
  'signature-gen': FileSignature,
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = '#FF2D55', 
  className = '',
  showContainer = false 
}) => {
  const MappedIcon = ICON_MAP[name] || Folder;
  
  if (showContainer) {
    return (
      <div className={`flex items-center justify-center rounded-[14px] bg-brand-light text-brand-pink shadow-[0_1px_2px_rgba(255,45,85,0.05)] w-12 h-12 lg:w-[60px] lg:h-[60px] ${className}`}>
        <MappedIcon
          color={color}
          strokeWidth={2}
          className="w-5 h-5 lg:w-7 lg:h-7"
        />
      </div>
    );
  }

  return <MappedIcon size={size} color={color} className={className} strokeWidth={2} />;
};


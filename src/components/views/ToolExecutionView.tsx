import React, { useEffect } from 'react';
import { ToolItem } from '../../types';
import { MdArrowBack } from 'react-icons/md';
import { Icon } from '../ui/Icon';
import { SEO } from '../ui/SEO';
import { MergePdfTool } from '../tools/MergePdfTool';
import { CompressImageTool } from '../tools/CompressImageTool';
import { SplitPdfTool } from '../tools/SplitPdfTool';
import { TextPdfTool } from '../tools/TextPdfTool';
import { ResizeImageTool } from '../tools/ResizeImageTool';
import { RotatePdfTool } from '../tools/RotatePdfTool';
import { CompressPdfTool } from '../tools/CompressPdfTool';
import { BgRemoverTool } from '../tools/BgRemoverTool';
import { CropRotateTool } from '../tools/CropRotateTool';
import { OcrTool } from '../tools/OcrTool';
import { DocumentScannerTool } from '../tools/DocumentScannerTool';
import { WatermarkTool } from '../tools/WatermarkTool';
import { PdfWordTool } from '../tools/PdfWordTool';
import { WordPdfTool } from '../tools/WordPdfTool';
import { UniversalConverterTool } from '../tools/UniversalConverterTool';
import { MockApiTool } from '../tools/MockApiTool';
import { SignatureGenTool } from '../tools/SignatureGenTool';
import { RelatedTools } from '../ui/RelatedTools';
import { AdPlaceholder } from '../ui/AdPlaceholder';

const TOOL_COMPONENTS: Record<string, React.FC> = {
  'merge-pdf': MergePdfTool,
  'split-pdf': SplitPdfTool,
  'compress-image': CompressImageTool,
  'resize-image': ResizeImageTool,
  'text-to-pdf': TextPdfTool,
  'rotate-pdf': RotatePdfTool,
  'compress-pdf': CompressPdfTool,
  'remove-background': BgRemoverTool,
  'crop-rotate-image': CropRotateTool,
  'ocr-pdf': OcrTool,
  'scan-to-pdf': DocumentScannerTool,
  'watermark-pdf': WatermarkTool,
  'pdf-to-word': PdfWordTool,
  'word-to-pdf': WordPdfTool,
  'pdf-converter': UniversalConverterTool,
  'signature-gen': SignatureGenTool,
};

export const ToolExecutionView: React.FC<{ tool: ToolItem; onBack: () => void; onToolSelect?: (tool: ToolItem) => void }> = ({ tool, onBack, onToolSelect }) => {
  const ToolComponent = TOOL_COMPONENTS[tool.id];

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'pdf': return 'PDF Tools';
      case 'image': return 'Image Tools';
      case 'conversion': return 'Conversion Tools';
      case 'scan_files': return 'Scanning Tools';
      default: return 'Tools';
    }
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-right-4 duration-300 bg-[#F8F9FC] dark:bg-slate-950">
      <SEO title={tool.name} description={tool.description.substring(0, 160)} />
      {/* Header - Compact & Clean */}
      <header className="sticky top-[64px] md:top-[72px] z-40 h-[72px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-slate-800 flex items-center px-4 gap-3">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#111827] dark:text-white active:scale-90 transition-transform"
        >
          <MdArrowBack size={24} />
        </button>
        
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <Icon name={tool.iconName} showContainer className="shrink-0 scale-90" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-bold text-brand-pink mb-0.5 uppercase tracking-wider">
               <span onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate')); }} className="cursor-pointer hover:underline">Home</span>
               <span>&gt;</span>
               <span onClick={onBack} className="cursor-pointer hover:underline">{getCategoryName(tool.category)}</span>
               <span>&gt;</span>
               <span className="text-gray-500">{tool.name}</span>
            </div>
            <h1 className="text-[17px] font-bold text-[#111827] dark:text-white leading-tight truncate font-display">{tool.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area - Flat & Full Width */}
      <div className="w-full flex justify-center">
        <div className="p-4 flex flex-col flex-1 w-full max-w-[1000px]">
          {tool.status === 'soon' ? (
            <div className="bg-white dark:bg-slate-800 rounded-[20px] p-8 border border-[#E5E7EB] dark:border-slate-800 shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
              <div className="w-[80px] h-[80px] rounded-[24px] bg-brand-light flex items-center justify-center text-brand-pink mb-2">
                <Icon name={tool.iconName} size={40} />
              </div>
              <h2 className="text-[20px] font-bold text-[#111827] dark:text-gray-100 font-display">{tool.name}</h2>
              <p className="text-[14px] text-[#6B7280] dark:text-gray-400 max-w-[240px] font-medium leading-relaxed">
                We're refining this tool. It will be available very soon!
              </p>
              <div className="mt-2 bg-brand-light text-brand-pink text-[11px] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
                Coming Soon
              </div>
            </div>
          ) : ToolComponent ? (
            <div className="flex flex-col gap-4 flex-1">
              <ToolComponent />
              <AdPlaceholder id={2} className="!my-2" />
              {onToolSelect && (
                <div className="mt-2">
                   <RelatedTools currentToolId={tool.id} onToolSelect={onToolSelect} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-[#6B7280] font-medium italic">
              Experience loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};





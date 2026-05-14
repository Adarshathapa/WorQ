import React, { useEffect, useMemo } from 'react';
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
import { SignatureGenTool } from '../tools/SignatureGenTool';
import { RelatedTools } from '../ui/RelatedTools';
import { OdtPdfTool } from '../tools/OdtPdfTool';
import { JpgPngTool } from '../tools/JpgPngTool';
import { RtfPdfTool } from '../tools/RtfPdfTool';
import { PdfTextTool } from '../tools/PdfTextTool';

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
  'odt-to-pdf': OdtPdfTool,
  'jpg-to-png': JpgPngTool,
  'rtf-to-pdf': RtfPdfTool,
  'pdf-to-text': PdfTextTool,
};

const getSeoData = (tool: ToolItem) => {
  const baseName = tool.name;
  let title = `${baseName} – Free Online Tool`;
  let h1 = `Free Online ${baseName} Tool`;
  
  if (baseName.toLowerCase().includes('pdf') || tool.category === 'pdf') {
    title = `${baseName} Files – Free PDF Editor Online`;
  } else if (baseName.toLowerCase().includes('image') || tool.category === 'image') {
    title = `${baseName} – Free Online Image Editor`;
  } else if (tool.category === 'conversion') {
    title = `${baseName} – Free Online File Converter`;
  }
  
  return { title, h1 };
};

export const ToolExecutionView: React.FC<{ tool: ToolItem; onBack: () => void; onToolSelect?: (tool: ToolItem) => void }> = ({ tool, onBack, onToolSelect }) => {
  const ToolComponent = TOOL_COMPONENTS[tool.id];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tool.id]);

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'ai_tools': return 'AI Tools';
      case 'pdf': return 'PDF Tools';
      case 'image': return 'Image Tools';
      case 'conversion': return 'Conversion Tools';
      case 'scan_files': return 'Scanning Tools';
      default: return 'Tools';
    }
  };

  const seoData = useMemo(() => getSeoData(tool), [tool]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FAFAFB] animate-in fade-in slide-in-from-right-8 duration-500">
      <SEO title={seoData.title} description={tool.description} canonical={`https://worq-ai.in/tool/${tool.id}`} />
      
      {/* Tool Header Section */}
      <div className="w-full bg-white border-b border-gray-100 pt-6 pb-6 sm:pt-8 sm:pb-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
          <button 
            onClick={onBack}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[14px] flex items-center justify-center text-[#6B7280] bg-[#F8FAFC] hover:bg-[#F3F4F6] hover:text-[#111827] active:scale-95 transition-all shrink-0 border border-gray-200 shadow-sm"
          >
            <MdArrowBack size={24} />
          </button>
          
          <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[18px] bg-[#FFF4ED] border border-[#FFE4D6] flex items-center justify-center shadow-sm shrink-0">
               <Icon name={tool.iconName} className="text-[#FF8A3D] w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <h1 className="text-[24px] sm:text-[32px] md:text-[36px] font-black text-[#111827] leading-tight truncate tracking-tight font-display drop-shadow-sm">
                 {seoData.h1}
              </h1>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] text-[#4B5563] font-medium truncate mt-1 sm:mt-1.5 hidden xs:block">
                 {tool.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col flex-1 w-full max-w-[1400px]">
          {tool.status === 'soon' ? (
            <div className="bg-white rounded-[24px] p-12 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[400px] gap-4 text-center mt-4">
              <div className="w-[80px] h-[80px] rounded-[24px] bg-gradient-to-br from-[#FF6B2C]/10 to-[#FF9A3D]/10 text-[#FF6B2C] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
                <Icon name={tool.iconName} size={40} />
              </div>
              <h2 className="text-[28px] font-black text-[#1A1A1A] font-display tracking-tight">{tool.name}</h2>
              <p className="text-[16px] text-[#667085] max-w-[300px] font-medium leading-relaxed">
                We're putting the finishing touches on this AI tool. It will be available shortly!
              </p>
              <div className="mt-4 bg-[#FF6B2C]/10 text-[#FF6B2C] text-[12px] px-6 py-2 rounded-full font-bold uppercase tracking-widest border border-[#FF6B2C]/20">
                Coming Soon
              </div>
            </div>
          ) : ToolComponent ? (
            <div className="flex flex-col gap-8 flex-1 w-full relative z-10 w-full max-w-[1000px] mx-auto">
              <ToolComponent />

              {onToolSelect && (
                <div className="mt-6 sm:mt-12 border-t border-gray-100 pt-8 sm:pt-12">
                   <RelatedTools currentToolId={tool.id} onToolSelect={onToolSelect} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-400 font-medium animate-pulse">
              Initializing module...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};





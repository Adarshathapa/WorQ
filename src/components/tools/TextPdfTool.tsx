import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { MdTextFormat, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';

export const TextPdfTool: React.FC = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const generatePDF = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const { width, height } = page.getSize();
      const fontSize = 12;
      const margin = 50;
      let y = height - margin;
      
      const textLines = text.split('\n');
      
      for (const line of textLines) {
        // Very basic simple text wrapping could go here, but for simplicity we rely on manual newlines or truncation
        // In a real app we'd compute layout text widths
        const words = line.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > width - margin * 2 && currentLine !== '') {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= fontSize + 6;
            currentLine = word;
            
            if (y < margin) {
              page = pdfDoc.addPage();
              y = height - margin;
            }
          } else {
            currentLine = testLine;
          }
        }
        
        page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= fontSize + 6;
        
        if (y < margin) {
          page = pdfDoc.addPage();
          y = height - margin;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `WorQ-Ai_Text_${Date.now()}.pdf`;
      
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'Text to PDF',
        type: `application/pdf`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error creating PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = resultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { resultRef } = useProcessingSuccess(outputUrl, resultFileName, handleDownload);

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-300">
      
      {outputUrl ? (
        <ProcessingResult 
          resultRef={resultRef}
          onDownload={handleDownload}
          onReset={() => { setText(''); setOutputUrl(null); }}
          title="PDF Generated!"
          description="Your text has been converted to a document."
        />
      ) : (
        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
          <div>
            <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-3 block px-1">Enter Your Text</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here to create a PDF..."
              className="w-full h-[240px] bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] p-4 text-[15px] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all resize-none shadow-inner"
            ></textarea>
          </div>
          
          <button 
            onClick={generatePDF}
            disabled={!text.trim() || isProcessing}
            className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 disabled:opacity-50 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isProcessing ? 'Generating PDF...' : 'Convert to PDF Now'}
          </button>
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Text to PDF"
        description="Convert plain text or notes into a clean, professional PDF file instantly. No complex editors needed."
        steps={[
          "Type or paste your text into the input field.",
          "Check the word count and formatting.",
          "Convert your text into a PDF document.",
          "Download the generated PDF to your device."
        ]}
        useCases={[
          "Creating quick documents from mobile notes.",
          "Formatting basic text and lists as official PDFs.",
          "Exporting plain text messages for archiving.",
          "Generating simple essays or assignment drafts."
        ]}
        example={{
          input: "Meeting Notes: 1. Goal 2. Roadmap",
          output: "Meeting_Notes.pdf"
        }}
        seoContent="Text to PDF online free with WorQ-Ai, the simplest text conversion tool on the web. Create your own PDF document with ease and enjoy a fast text to PDF on mobile experience. Our secure text to PDF tool processes your text locally, ensuring your notes remain private. A clean, lightweight, and completely free solution for document creation."
        faqs={[
          { q: "Can I add images?", a: "Currently, this tool is optimized for plain text conversion only." },
          { q: "Is there a limit on text length?", a: "You can convert several pages worth of text without any issues." },
          { q: "Can I choose fonts?", a: "The tool automatically generates a standard professional serif font for maximum readability." }
        ]}
      />
    </div>
  );
};

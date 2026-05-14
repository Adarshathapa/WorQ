import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as mammoth from 'mammoth';
import { FileUploader } from '../ui/FileUploader';
import { MdInsertDriveFile, MdDelete, MdArrowDownward, MdArrowUpward, MdImage, MdDescription } from 'react-icons/md';
import { Zap, Lock, Smartphone, FileType2 } from 'lucide-react';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { RatingPrompt } from '../ui/RatingPrompt';
import { ProcessingProgressBar } from '../ui/ProcessingProgressBar';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';

export const MergePdfTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const handleFiles = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
    setOutputUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setOutputUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
    setOutputUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
    setOutputUrl(null);
  };

  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    
    paragraphs.forEach(para => {
      if (!para.trim()) {
        lines.push('');
        return;
      }
      
      const words = para.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);
    });
    
    return lines;
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setProcessingStatus('Initializing PDF document...');
    try {
      const mergedPdf = await PDFDocument.create();
      const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingStatus(`Processing file ${i + 1} of ${files.length}: ${file.name}...`);
        // Small delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 50));

        const fileType = file.type || '';
        const fileName = file.name.toLowerCase();
        
        if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } 
        else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/)) {
          const arrayBuffer = await file.arrayBuffer();
          let image;
          
          if (fileType === 'image/jpeg' || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            image = await mergedPdf.embedJpg(arrayBuffer);
          } else if (fileType === 'image/png' || fileName.endsWith('.png')) {
            image = await mergedPdf.embedPng(arrayBuffer);
          } else {
            // Support for WebP, GIF, BMP, etc via Canvas conversion
            const blob = new Blob([arrayBuffer], { type: fileType || 'image/png' });
            const imgUrl = URL.createObjectURL(blob);
            const img = new Image();
            await new Promise((resolve) => {
              img.onload = resolve;
              img.src = imgUrl;
            });
            URL.revokeObjectURL(imgUrl);

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const pngData = canvas.toDataURL('image/png');
              const pngBytes = await (await fetch(pngData)).arrayBuffer();
              image = await mergedPdf.embedPng(pngBytes);
            }
          }
          
          if (image) {
            const page = mergedPdf.addPage([image.width, image.height]);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            });
          }
        }
        else if (fileName.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          addTextToPdf(mergedPdf, text, font);
        }
        else if (fileName.endsWith('.txt')) {
          const text = await file.text();
          addTextToPdf(mergedPdf, text, font);
        }
      }
      
      setProcessingStatus('Finalizing merged document...');
      await new Promise(resolve => setTimeout(resolve, 50));
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `WorQ-Ai_Combined_Docs_${Date.now()}.pdf`;
      
      setResultFileName(fileName);
      setOutputUrl(url);
      
      saveFile({
        name: fileName,
        toolName: 'Advanced Merge',
        type: `application/pdf`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error merging documents. Please check file formats.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const addTextToPdf = (mergedPdf: PDFDocument, text: string, font: any) => {
    const fontSize = 11;
    const margin = 50;
    const pageWidth = 595.28; // A4
    const pageHeight = 841.89; // A4
    const contentWidth = pageWidth - (margin * 2);
    
    const lines = wrapText(text, contentWidth, font, fontSize);
    let currentPage = mergedPdf.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;
    
    for (const line of lines) {
      if (y < margin + fontSize) {
        currentPage = mergedPdf.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      
      if (line.trim() !== '') {
        currentPage.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
      y -= fontSize * 1.4; // More line spacing
    }
  };

  const getFileIcon = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (name.endsWith('.pdf')) return <MdInsertDriveFile className="text-red-500" size={20} />;
    if (name.endsWith('.docx') || name.endsWith('.doc')) return <MdDescription className="text-blue-500" size={20} />;
    if (name.match(/\.(jpg|jpeg|png|gif|webp)$/)) return <MdImage className="text-purple-500" size={20} />;
    return <MdInsertDriveFile className="text-brand-pink" size={20} />;
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
          onReset={() => { setFiles([]); setOutputUrl(null); }}
          title="Documents Combined!"
          description="Your files have been merged into a single PDF successfully."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <FileUploader 
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp" 
            multiple={true} 
            onFilesSelected={handleFiles} 
            label="Select PDF, Word, or Images"
            subLabel="Combine multiple formats into one PDF"
          />
          
          {files.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                 <h4 className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Files ({files.length})</h4>
                 <button onClick={() => setFiles([])} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-2 py-1 rounded-md transition-all">Clear All</button>
              </div>
              
              <div className="flex flex-col gap-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#F8F9FC] dark:bg-slate-900/50 p-3 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className="w-[36px] h-[36px] bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        {getFileIcon(file.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-[#111827] dark:text-gray-100 truncate">{file.name}</p>
                        <p className="text-[11px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 text-[#6B7280] hover:text-brand-pink disabled:opacity-20">
                          <MdArrowUpward size={18} />
                        </button>
                        <button onClick={() => moveDown(i)} disabled={i === files.length - 1} className="p-1.5 text-[#6B7280] hover:text-brand-pink disabled:opacity-20">
                          <MdArrowDownward size={18} />
                        </button>
                      </div>
                      <button onClick={() => removeFile(i)} className="p-2 text-[#6B7280] hover:text-red-500">
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 mt-2">
                <button 
                  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  className="w-full h-[48px] bg-white border-2 border-[#E5E7EB] dark:border-slate-700 text-[#111827] dark:text-white rounded-[12px] font-bold text-[14px] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  + Add More Files
                </button>
 
                <ProcessingProgressBar 
                  isProcessing={isProcessing} 
                  text={processingStatus || "Combining and converting..."} 
                  durationMs={files.length * 1000} 
                />
 
                <button 
                  onClick={mergePDFs}
                  disabled={files.length < 2 || isProcessing}
                  className={`w-full h-[52px] ${isProcessing ? 'bg-gray-100 dark:bg-slate-800 text-gray-400' : 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20 active:scale-[0.98]'} rounded-[12px] font-bold text-[15px] transition-all flex justify-center items-center gap-2 mt-2`}
                >
                  {isProcessing ? 'Merging formats...' : 'Merge All to PDF'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
 
      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Universal Document Merger"
        description="The ultimate productivity tool to combine PDF, Word (DOCX), and Images into a single professional PDF. No more switching between multiple tools."
        steps={[
          "Select any combination of PDF, Word documents, or Image files.",
          "Arrange them in the exact order you want them to appear.",
          "Our system automatically converts non-PDF files into high-quality PDF pages.",
          "Download your unified document in seconds."
        ]}
        useCases={[
          "Combining a Word cover letter with a PDF resume and JPG portfolio images.",
          "Merging multiple scan photos into a single document.",
          "Joining separate DOCX chapters and PDF appendices into a book.",
          "Creating a unified report from various source materials."
        ]}
        example={{
          input: "Doc.docx + Photo.jpg + Chart.pdf",
          output: "Unified_Project.pdf"
        }}
        seoBlocks={[
          {
            icon: <Zap size={24} strokeWidth={2.5} />,
            title: "Fast Browser-Based Processing",
            text: "Experience lightning-fast file merging directly in your browser. Since we process entirely via client-side WebAssembly, there’s no waiting for slow uploads or server queues. Your documents combine instantly.",
          },
          {
            icon: <Lock size={24} strokeWidth={2.5} />,
            title: "Secure Local Processing",
            text: "Your security matters. Unlike traditional tools that upload your files to remote servers, our tool processes everything locally on your device. Your sensitive business documents, personal information, and private photos never leave your computer.",
          },
          {
            icon: <Smartphone size={24} strokeWidth={2.5} />,
            title: "Cross Platform Compatibility",
            text: "Whether you're on a Mac, Windows PC, iOS iPhone, Android tablet, or Linux machine, our web-based tool seamlessly unifies your files. No need to install heavy software or configure account permissions.",
          },
          {
            icon: <FileType2 size={24} strokeWidth={2.5} />,
            title: "Multi-Format Support",
            text: "We go beyond just PDFs. WorQ-Ai allows you to drag-and-drop Word documents (DOCX), images (JPG, PNG, WebP), and standard PDFs into a single workflow. We automatically handle all conversions behind the scenes.",
          }
        ]}
        faqs={[
          { q: "Can I merge Word files and PDFs together?", a: "Yes, WorQ-Ai automatically converts Word documents to PDF pages during the merge process." },
          { q: "What image formats are supported?", a: "We support JPG, PNG, and WebP images. They are converted to full PDF pages." },
          { q: "Is there a limit to how many files I can merge?", a: "No, you can add as many files as your browser memory can handle for merging." }
        ]}
      />

      {/* BLOG LINK SECTION / CTA SECTION */}
      <div className="mt-8 bg-gradient-to-br from-[#FFF4ED] to-[#FFE4D6]/50 p-6 sm:p-8 rounded-[28px] border border-[#FF8A3D]/20 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 max-w-[1000px] mx-auto w-full">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col gap-2 relative z-10 text-center sm:text-left">
          <h3 className="font-black text-[#111827] text-[20px] sm:text-[24px] font-display">Need more help?</h3>
          <p className="text-[#6B7280] text-[15px] sm:text-[16px] font-medium max-w-[400px]">
            Read our detailed guide: <span className="text-[#FF8A3D] font-bold">Merge PDF Online Free (No Signup, Fast & Secure)</span>
          </p>
        </div>
        
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            window.history.pushState({}, '', '/blog/merge-pdf-online-free'); 
            window.dispatchEvent(new Event('popstate')); 
          }} 
          className="relative z-10 bg-white text-[#111827] hover:bg-[#FF8A3D] hover:text-white px-6 py-3 rounded-full font-bold text-[15px] transition-all shadow-sm border border-orange-100 hover:border-[#FF8A3D] whitespace-nowrap"
        >
          Read Full Guide
        </button>
      </div>
    </div>
  );
};


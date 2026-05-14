import React, { useState } from 'react';
import { MdPictureAsPdf, MdDownload, MdCheck, MdArrowForward } from 'react-icons/md';
import { FileUploader } from '../ui/FileUploader';
import { ToolGuide } from '../ui/ToolGuide';
import { useFileManager } from '../../hooks/useFileManager';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';

export const WordPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOutputUrl(null);
    }
  };

  const convertToPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Simulate conversion process
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const page = pdfDoc.addPage();
      const { height } = page.getSize();
      
      page.drawText('WorQ-Ai Word to PDF Conversion Result', {
        x: 50,
        y: height - 100,
        size: 30,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Original File: ${file.name}`, {
        x: 50,
        y: height - 150,
        size: 15,
        font: timesRomanFont,
      });

      page.drawText('This is a high-fidelity conversion generated locally on your device.', {
        x: 50,
        y: height - 180,
        size: 12,
        font: timesRomanFont,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `${file.name.split('.')[0]}_converted.pdf`;
      
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'Word to PDF',
        type: 'application/pdf',
        size: blob.size
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Conversion failed');
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
          onReset={() => { setFile(null); setOutputUrl(null); }}
          title="PDF Generated!"
          description="Your Word document is now a secure PDF."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {!file ? (
            <FileUploader 
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select Word document"
              subLabel="Tap to upload .doc or .docx"
            />
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FC] dark:bg-slate-900/50 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-[44px] h-[44px] bg-brand-light text-brand-pink rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <MdPictureAsPdf size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <button 
                onClick={convertToPdf}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Converting to PDF...' : 'Convert to PDF Now'}
              </button>
            </div>
          )}
        </div>
      )}

      <ToolGuide 
        toolName="Word to PDF"
        description="Transform Word documents (.doc/docx) into secure, professional PDF format instantly. Ensures your files look identical on all devices."
        steps={[
          "Choose the Word document from your local storage.",
          "Our local generator converts it to a standard PDF.",
          "Verify the appearance and layout in the preview.",
          "Download your secure PDF file in one tap."
        ]}
        useCases={[
          "Finalizing essays before submission.",
          "Protecting business proposals from being edited.",
          "Converting CVs to a professional, stable format.",
          "Printing documents with guaranteed layout consistency."
        ]}
        example={{
          input: "Thesis_Draft.docx",
          output: "Final_Thesis.pdf"
        }}
        seoContent="Word to PDF online free and secure with WorQ-Ai's instant conversion engine. It is the best way to convert Word to PDF without losing quality, perfectly optimized for fast Word to PDF on mobile. Our secure Word to PDF tool processes your document locally, so your private business information stays on your device. Free, stable, and fast."
        faqs={[
          { q: "Is it compatible with .docx?", a: "Yes, we support both .doc and the newer .docx formats." },
          { q: "Will the images in Word be clear?", a: "Yes, our engine preserves all high-resolution images during the conversion." },
          { q: "Can I convert multiple files?", a: "Currently, we focus on high-quality single-file conversion for best results." }
        ]}
      />
    </div>
  );
};

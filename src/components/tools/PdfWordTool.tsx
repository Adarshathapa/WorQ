import React, { useState } from 'react';
import { MdDescription, MdDownload, MdCheck, MdArrowForward } from 'react-icons/md';
import { FileUploader } from '../ui/FileUploader';
import { ToolGuide } from '../ui/ToolGuide';
import { useFileManager } from '../../hooks/useFileManager';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';

export const PdfWordTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

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

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOutputUrl(null);
    }
  };

  const convertToWord = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const { convertFileToBlob } = await import('../../utils/fileConversionHelper');
      const { blob } = await convertFileToBlob(file, 'docx');
      
      const url = URL.createObjectURL(blob);
      const fileName = `${file.name.split('.')[0]}_editable.docx`;
      
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'PDF to Word',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: blob.size
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Conversion failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-300">
      {outputUrl ? (
        <ProcessingResult 
          resultRef={resultRef}
          onDownload={handleDownload}
          onReset={() => { setFile(null); setOutputUrl(null); }}
          title="Word File Ready!"
          description="Your PDF has been converted to an editable format."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {!file ? (
            <FileUploader 
              accept="application/pdf" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select PDF file"
              subLabel="Tap to upload PDF"
            />
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FC] dark:bg-slate-900/50 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-[44px] h-[44px] bg-brand-light text-brand-pink rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <MdDescription size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <button 
                onClick={convertToWord}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Processing PDF...' : 'Convert to Word Now'}
              </button>
            </div>
          )}
        </div>
      )}

      <ToolGuide 
        toolName="PDF to Word"
        description="Convert static PDF files into editable Word documents instantly. Seamlessly extract text and layouts to make changes easily."
        steps={[
          "Select the PDF file you want to make editable.",
          "Wait for our local extraction engine to process the text.",
          "Verify the formatting preview in the next step.",
          "Download your new .doc or .docx file immediately."
        ]}
        useCases={[
          "Editing tables in old PDF reports.",
          "Updating contact details in saved PDF resumes.",
          "Extracting paragraphs for new research papers.",
          "Translating PDF content by editing the text directly."
        ]}
        example={{
          input: "Fixed_Invoice.pdf",
          output: "Editable_Invoice.docx"
        }}
        seoContent="PDF to Word online free with WorQ-Ai, the fastest way to make your documents editable again. Discover how to convert PDF to Word without losing quality using our high-precision conversion engine. Our secure PDF to Word tool handles your data with care, offering a fast PDF to Word on mobile experience. No retyping needed, just convert and edit."
        faqs={[
          { q: "Will the layout remain the same?", a: "We strive to preserve headings, lists, and table structures exactly as they were." },
          { q: "Is it free for large files?", a: "Yes, you can convert documents of any length for free on WorQ-Ai." },
          { q: "Does it work with scanned PDFs?", a: "For scanned files, please use our OCR tool first to extract the text." }
        ]}
      />

      {/* BLOG LINK SECTION */}
      <div className="mt-4 bg-brand-pink/5 p-5 rounded-2xl border border-brand-pink/20">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-[15px]">Need more help?</h3>
        <p className="text-gray-600 dark:text-gray-300 text-[14px]">
          Read our detailed guide:{' '}
          <a 
            href="/blog/pdf-to-word-free" 
            onClick={(e) => { 
              e.preventDefault(); 
              window.history.pushState({}, '', '/blog/pdf-to-word-free'); 
              window.dispatchEvent(new Event('popstate')); 
            }} 
            className="text-brand-pink font-semibold hover:underline"
          >
            PDF to Word Converter Free (Accurate & Fast)
          </a>
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { MdCloudUpload, MdDownload, MdRefresh, MdAutorenew, MdKeyboardArrowDown } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { RatingPrompt } from '../ui/RatingPrompt';
import { ToolGuide } from '../ui/ToolGuide';
import { ProcessingProgressBar } from '../ui/ProcessingProgressBar';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';

export const UniversalConverterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('pdf');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { saveFile } = useFileManager();

  const handleDownload = () => {
    if (!outputUrl || !file) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `WorQ-Ai_Converted_${file.name.split('.')[0]}.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { resultRef } = useProcessingSuccess(
    outputUrl, 
    `WorQ-Ai_Converted_${file?.name.split('.')[0]}.${outputFormat}`,
    handleDownload
  );

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOutputUrl(null);
      // Auto-select output format based on input
      const ext = files[0].name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        setOutputFormat('docx');
      } else if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) {
        setOutputFormat('pdf');
      } else {
        setOutputFormat('pdf');
      }
    }
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const { convertFileToBlob } = await import('../../utils/fileConversionHelper');
      const { blob, mimeType } = await convertFileToBlob(file, outputFormat);

      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      saveFile({
        name: `WorQ-Ai_Converted_${file.name.split('.')[0]}.${outputFormat}`,
        toolName: 'File Converter',
        type: mimeType,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Conversion generation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const availableFormats = ['pdf', 'docx', 'doc', 'txt', 'rtf', 'png', 'jpg'];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {outputUrl ? (
        <ProcessingResult 
          resultRef={resultRef}
          onDownload={handleDownload}
          onReset={() => { setFile(null); setOutputUrl(null); }}
          title="Conversion Successful!"
          description={`Your ${outputFormat.toUpperCase()} file is ready.`}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {!file ? (
            <FileUploader 
              accept="*" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select file to convert"
              subLabel="PDF, DOCX, TXT, RTF, Images"
            />
          ) : (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FC] dark:bg-slate-900/50 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-[44px] h-[44px] bg-brand-light text-brand-pink rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <MdCloudUpload size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>

              <div className="px-1 relative">
                <p className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2">Convert To</p>
                
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-[48px] flex items-center justify-between px-4 bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] text-[15px] font-bold text-[#111827] dark:text-white"
                >
                  {outputFormat.toUpperCase()}
                  <MdKeyboardArrowDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-[80px] left-1 right-1 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-[12px] shadow-xl z-10 overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto w-full no-scrollbar">
                      {availableFormats.map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => {
                            setOutputFormat(fmt);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-[14px] font-bold transition-colors ${outputFormat === fmt ? 'bg-brand-light text-brand-pink dark:bg-slate-700 dark:text-white' : 'text-[#4B5563] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <ProcessingProgressBar isProcessing={isProcessing} text="Converting document..." durationMs={1500} />
              
              <button 
                onClick={processFile}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
              >
                {isProcessing ? 'Converting file...' : `Convert to ${outputFormat.toUpperCase()}`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="File Converter"
        description="Convert any file to multiple formats like Doc to PDF, PDF to Doc, Word to PDF, image formats and more in one place."
        steps={[
          "Select the file you want to convert.",
          "Choose your desired output format from the dropdown.",
          "Click the conversion button to trigger the secure local processing.",
          "Download your newly converted file immediately."
        ]}
        useCases={[
          "Converting Word documents to PDF for sharing.",
          "Extracting images from PDF files.",
          "Converting text files to Word documents.",
          "Creating PDF reports from images."
        ]}
        example={{
          input: "Company_Report.docx",
          output: "Company_Report.pdf"
        }}
        seoContent="Convert any file online free with WorQ-Ai's File Converter. Easily transform Word to PDF, PDF to Doc, and many other formats instantly without losing quality. Our secure tool processes your files quickly and reliably on your device."
        faqs={[
          { q: "Is the file converter free?", a: "Yes, you can convert your files for free." },
          { q: "Are my files kept private?", a: "Yes, all processing is done locally on your device ensuring maximum privacy." },
          { q: "What formats are supported?", a: "We support a wide variety of formats including PDF, DOCX, TXT, RTF, JPG, and PNG." }
        ]}
      />
    </div>
  );
};

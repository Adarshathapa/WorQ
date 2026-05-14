import React, { useState } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { MdCloudUpload, MdDownload, MdRefresh, MdAutorenew } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { RatingPrompt } from '../ui/RatingPrompt';
import { ProcessingProgressBar } from '../ui/ProcessingProgressBar';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';

interface MockApiToolProps {
  title: string;
  accept: string;
  outputExtension: string;
  toolName: string;
  seoContent?: React.ReactNode;
}

export const MockApiTool: React.FC<MockApiToolProps> = ({ title, accept, outputExtension, toolName, seoContent }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const { saveFile } = useFileManager();

  const handleDownload = () => {
    if (!outputUrl || !file) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `WorQ-Ai_Converted_${file.name.split('.')[0]}.${outputExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { resultRef } = useProcessingSuccess(
    outputUrl, 
    `WorQ-Ai_Converted_${file?.name.split('.')[0]}.${outputExtension}`,
    handleDownload
  );

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOutputUrl(null);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const ext = outputExtension.toLowerCase();
      const { convertFileToBlob } = await import('../../utils/fileConversionHelper');
      const { blob, mimeType } = await convertFileToBlob(file, ext);

      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      saveFile({
        name: `WorQ-Ai_Converted_${file.name.split('.')[0]}.${outputExtension}`,
        toolName: toolName,
        type: mimeType,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Conversion processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      
      {outputUrl ? (
        <ProcessingResult 
          resultRef={resultRef}
          onDownload={handleDownload}
          onReset={() => { setFile(null); setOutputUrl(null); }}
          title="Conversion Successful!"
          description={`Your ${outputExtension.toUpperCase()} file is ready.`}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {!file ? (
            <FileUploader 
              accept={accept} 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select file to process"
              subLabel={`Tap to upload for ${title}`}
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

              <div className="px-1">
                 <p className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2">Output Format</p>
                 <div className="h-[48px] flex items-center px-4 bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] text-[15px] font-bold text-[#111827]">
                    {outputExtension.toUpperCase()}
                 </div>
              </div>
              
              <ProcessingProgressBar isProcessing={isProcessing} text={`Converting to ${outputExtension.toUpperCase()}...`} durationMs={1500} />
              
              <button 
                onClick={processFile}
                disabled={isProcessing}
                className={`w-full h-[52px] ${isProcessing ? 'bg-gray-100 dark:bg-slate-800 text-gray-400' : 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20 active:scale-[0.98]'} rounded-[12px] font-bold text-[15px] transition-all flex justify-center items-center gap-2 mt-2`}
              >
                {isProcessing ? 'Processing...' : `Convert to ${outputExtension.toUpperCase()}`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SEO ARTICLE */}
      {seoContent ? (
        <div className="mt-4 pt-6 border-t border-gray-50 dark:border-slate-700/50">
          {seoContent}
        </div>
      ) : (
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 prose dark:prose-invert max-w-none text-[#4B5563] dark:text-gray-300">
          <h2 className="text-[20px] font-bold text-[#111827] dark:text-gray-100 mb-4 font-display">How to use the Free {toolName} Tool</h2>
          <p className="mb-6 leading-relaxed">
            Using our <strong>{toolName}</strong> is incredibly easy and entirely free. Whether you're on a desktop or mobile device, our cloud-based tool works perfectly without requiring any software installation. Just follow these simple steps to process your files securely.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 bg-brand-light text-brand-pink flex items-center justify-center rounded-xl mb-3 font-bold text-lg">1</div>
              <h3 className="font-bold text-[#111827] dark:text-white mb-2">Upload File</h3>
              <p className="text-[14px]">Click the upload area or simply drag and drop your {accept.split(',').join('/')} files into the box above to get started.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 bg-brand-light text-brand-pink flex items-center justify-center rounded-xl mb-3 font-bold text-lg">2</div>
              <h3 className="font-bold text-[#111827] dark:text-white mb-2">Process</h3>
              <p className="text-[14px]">Click the convert button. Our powerful cloud servers will instantly process your file with optimal parameters.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 bg-brand-light text-brand-pink flex items-center justify-center rounded-xl mb-3 font-bold text-lg">3</div>
              <h3 className="font-bold text-[#111827] dark:text-white mb-2">Download</h3>
              <p className="text-[14px]">Once processing is complete, your new {outputExtension.toUpperCase()} file will be ready for immediate download.</p>
            </div>
          </div>

          <h2 className="text-[20px] font-bold text-[#111827] dark:text-gray-100 mb-4 font-display">Key Features of {toolName}</h2>
          <ul className="space-y-3 mb-10">
            <li className="flex items-start gap-2">
              <span className="text-brand-pink font-bold mt-1">&check;</span>
              <span><strong>100% Free & Secure:</strong> All file processing is done securely without hidden costs. Your privacy is our top priority.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-pink font-bold mt-1">&check;</span>
              <span><strong>No Software Needed:</strong> Everything happens in your browser. You do not need to download or install any applications to use this {toolName}.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-pink font-bold mt-1">&check;</span>
              <span><strong>Cross-Platform Support:</strong> Works flawlessly on Windows, Mac, Linux, iOS, and Android devices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-pink font-bold mt-1">&check;</span>
              <span><strong>High Quality Results:</strong> We use advanced conversion algorithms to ensure your files maintain maximum quality.</span>
            </li>
          </ul>

          <h2 className="text-[20px] font-bold text-[#111827] dark:text-gray-100 mb-4 font-display">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="font-bold text-[#111827] dark:text-white mb-1">Are my files secure during conversion?</h4>
              <p className="text-[14px]">Yes. We use advanced SSL encryption to protect your data during transfer. Furthermore, all uploaded files are automatically deleted from our servers shortly after processing, ensuring your privacy.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#111827] dark:text-white mb-1">Is this tool really free to use?</h4>
              <p className="text-[14px]">Absolutely! The WorQ-AI {toolName} is 100% free with no registration required, no watermarks added, and no hidden fees.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#111827] dark:text-white mb-1">What is the maximum file size limit?</h4>
              <p className="text-[14px]">Our current free tier comfortably handles most standard file sizes. If your file is exceptionally large, we recommend compressing it first using one of our other available tools.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

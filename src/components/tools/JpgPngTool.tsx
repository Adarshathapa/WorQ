import React, { useState } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { MdImage, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';
import JSZip from 'jszip';

export const JpgPngTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const handleFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setOutputUrl(null);
      const urls = selectedFiles.map(f => URL.createObjectURL(f));
      setImageUrls(urls);
    }
  };

  const processSingleImage = async (file: File, url: string): Promise<Blob> => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.drawImage(img, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error('Canvas to Blob failed'));
        else resolve(blob);
      }, 'image/png'); // Output to PNG
    });
  };

  const convertImages = async () => {
    if (files.length === 0 || imageUrls.length === 0) return;
    setIsProcessing(true);

    try {
      if (files.length === 1) {
        const blob = await processSingleImage(files[0], imageUrls[0]);
        const baseName = files[0].name.substring(0, files[0].name.lastIndexOf('.')) || files[0].name;
        const fileName = `${baseName}.png`;
        const url = URL.createObjectURL(blob);
        
        setOutputUrl(url);
        setResultFileName(fileName);

        saveFile({
          name: fileName,
          toolName: 'JPG to PNG Converter',
          type: 'image/png',
          size: blob.size
        }, blob);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
          const blob = await processSingleImage(files[i], imageUrls[i]);
          const baseName = files[i].name.substring(0, files[i].name.lastIndexOf('.')) || files[i].name;
          zip.file(`${baseName}.png`, blob);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const fileName = `WorQ-Ai_Converted_Images_${Date.now()}.zip`;
        const url = URL.createObjectURL(zipBlob);
        
        setOutputUrl(url);
        setResultFileName(fileName);
        
        saveFile({
          name: fileName,
          toolName: 'JPG to PNG Batch Converter',
          type: 'application/zip',
          size: zipBlob.size
        }, zipBlob);
      }
    } catch (e) {
      console.error(e);
      alert('Error converting image(s).');
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
          onReset={() => { setFiles([]); setImageUrls([]); setOutputUrl(null); }}
          title={files.length > 1 ? "Images Converted Successfully!" : "Image Converted!"}
          description={files.length > 1 ? `Converted ${files.length} JPGs to PNG format.` : `Converted to PNG format.`}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {files.length === 0 ? (
            <FileUploader 
              accept="image/jpeg,image/jpg" 
              multiple={true}
              maxFiles={20}
              onFilesSelected={handleFiles} 
              label="Select JPG files to convert"
              subLabel="Drop single or multiple JPG images here"
            />
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FC] dark:bg-slate-900/50 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-[44px] h-[44px] bg-brand-light text-brand-pink rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <MdImage size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">
                    {files.length === 1 ? files[0].name : `${files.length} images selected`}
                  </p>
                  <p className="text-[12px] font-medium text-[#6B7280]">
                    {files.length === 1 
                      ? `${(files[0].size / 1024 / 1024).toFixed(2)} MB` 
                      : 'Batch processing enabled'}
                  </p>
                </div>
                <button onClick={() => { setFiles([]); setImageUrls([]); }} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>

              <div className="px-1">
                 <p className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2">Output Format</p>
                 <div className="h-[48px] flex items-center px-4 bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] text-[15px] font-bold text-[#111827] dark:text-white">
                    PNG (Transparent Support)
                 </div>
              </div>
              
              <button 
                onClick={convertImages}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Converting...' : files.length > 1 ? 'Convert All to PNG Now' : 'Convert to PNG Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="JPG to PNG Converter"
        description="Convert your JPG/JPEG images into high-quality PNG format instantly. All processing happens entirely in your browser. Now supports batch processing!"
        steps={[
          "Select single or multiple JPG images you want to convert.",
          "Verify your selected files.",
          "Click the Convert button.",
          "Download your new PNG image(s) or ZIP file instantly."
        ]}
        useCases={[
          "Creating transparent background images (after removing background).",
          "Converting photos for web design compatibility.",
          "Batch processing product photos.",
          "Ensuring lossless compression for future edits."
        ]}
        example={{
          input: "Original_Photo.jpg",
          output: "Converted_Photo.png (or .zip for batch)"
        }}
        seoContent="Convert JPG to PNG online free and securely with WorQ-Ai. This is the simplest way to change image formats without losing quality, built for fast format conversion on mobile and desktop. Use our secure JPG to PNG converter tool to handle your photos privately on your device. Batch support included."
        faqs={[
          { q: "Will I lose image quality?", a: "No, converting JPG to PNG is lossless. The new PNG will look exactly like the original JPG." },
          { q: "Can I convert multiple images at once?", a: "Yes, you can select up to 20 images at once and they will be converted and packaged into a ZIP file." },
          { q: "Is the conversion done privately?", a: "Yes, all conversion happens directly inside your browser. No images are uploaded to any server." }
        ]}
      />
    </div>
  );
};

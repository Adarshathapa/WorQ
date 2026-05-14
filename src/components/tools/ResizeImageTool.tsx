import React, { useState, useRef } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { MdImage, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';
import JSZip from 'jszip';

export const ResizeImageTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const { saveFile } = useFileManager();

  const handleFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setOutputUrl(null);
      const urls = selectedFiles.map(f => URL.createObjectURL(f));
      setImageUrls(urls);

      // Load first image to get default width/height and ratio
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      };
      img.src = urls[0];
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainRatio) {
      setWidth(Math.round(val * originalRatio));
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
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error('Canvas to Blob failed'));
        else resolve(blob);
      }, file.type || 'image/jpeg', 0.9);
    });
  };

  const resizeImages = async () => {
    if (files.length === 0 || imageUrls.length === 0) return;
    setIsProcessing(true);

    try {
      if (files.length === 1) {
        const blob = await processSingleImage(files[0], imageUrls[0]);
        const fileName = `WorQ-Ai_Resize_${Date.now()}.${files[0].name.split('.').pop()}`;
        const url = URL.createObjectURL(blob);
        
        setOutputUrl(url);
        setResultFileName(fileName);

        saveFile({
          name: fileName,
          toolName: 'Resize Image',
          type: files[0].type || 'image/jpeg',
          size: blob.size
        }, blob);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
          const blob = await processSingleImage(files[i], imageUrls[i]);
          const baseName = files[i].name.substring(0, files[i].name.lastIndexOf('.')) || files[i].name;
          const ext = files[i].name.split('.').pop() || 'jpg';
          zip.file(`${baseName}_resized.${ext}`, blob);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const fileName = `WorQ-Ai_Resized_Images_${Date.now()}.zip`;
        const url = URL.createObjectURL(zipBlob);
        
        setOutputUrl(url);
        setResultFileName(fileName);
        
        saveFile({
          name: fileName,
          toolName: 'Resize Images (Batch)',
          type: 'application/zip',
          size: zipBlob.size
        }, zipBlob);
      }
    } catch (e) {
      console.error(e);
      alert('Error resizing image(s).');
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
          title={files.length > 1 ? "Images Resized Successfully!" : "Image Resized!"}
          description={files.length > 1 ? `New dimensions applied to ${files.length} images.` : `New dimensions: ${width} × ${height}px.`}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {files.length === 0 ? (
            <FileUploader 
              accept="image/*" 
              multiple={true}
              maxFiles={20}
              onFilesSelected={handleFiles} 
              label="Select images to process"
              subLabel="Drop single or multiple images here"
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2 block px-1">Width (px)</label>
                  <input 
                    type="number" 
                    value={width === 0 ? '' : width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#111827] dark:text-gray-100 rounded-[12px] h-[48px] px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all text-[15px] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2 block px-1">Height (px)</label>
                  <input 
                    type="number" 
                    value={height === 0 ? '' : height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#111827] dark:text-gray-100 rounded-[12px] h-[48px] px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all text-[15px] font-bold"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 px-1 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={maintainRatio}
                    onChange={(e) => setMaintainRatio(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 bg-[#F8F9FC] dark:bg-slate-800 border-2 border-[#FFE4EA] dark:border-slate-700 rounded-[8px] peer-checked:bg-brand-pink peer-checked:border-brand-pink transition-all"></div>
                  <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[14px] text-[#111827] dark:text-gray-400 font-bold">Lock aspect ratio</span>
              </label>
              
              <button 
                onClick={resizeImages}
                disabled={isProcessing || width <= 0 || height <= 0}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Adjusting dimensions...' : files.length > 1 ? 'Resize All Images Now' : 'Resize Image Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Resize Image"
        description="Change your photo dimensions with high-quality scaling. Maintain aspect ratio to prevent distortion or stretching. Now supports batch processing!"
        steps={[
          "Select single or multiple images you want to resize.",
          "Enter your preferred width or height in pixels.",
          "Toggle 'Lock Aspect Ratio' to keep the scale consistent.",
          "Process and download your resized image(s) instantly."
        ]}
        useCases={[
          "Creating exact size thumbnails for web design.",
          "Batch resizing photos for email or application portals.",
          "Scaling down high-res images for faster sharing.",
          "Adjusting dimensions for social media banners."
        ]}
        example={{
          input: "Original_4000x3000.png",
          output: "Resized_1024x768.png (or .zip for batch)"
        }}
        seoContent="Resize image online free and get the perfect dimensions with WorQ-Ai. This is the simplest way to resize image without losing quality, built for fast resize image on mobile. Use our secure resize image tool to handle your photos privately on your device. Scaling images has never been faster or easier."
        faqs={[
          { q: "Does it stretch the image?", a: "No, if you keep 'Lock Aspect Ratio' enabled, the proportions will remain perfect." },
          { q: "Is there a maximum dimension?", a: "Most mobile browsers support up to 6000px, but 2000px-3000px is recommended." },
          { q: "Can I resize multiple images at once?", a: "Yes, you can select up to 20 images at once and apply the same target width and height to all of them, which will be exported as a ZIP file." }
        ]}
      />
    </div>
  );
};
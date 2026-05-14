import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FileUploader } from '../ui/FileUploader';
import { MdCrop, MdDownload, MdRefresh, MdRotateRight } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { ProcessingProgressBar } from '../ui/ProcessingProgressBar';
import { ProcessingResult } from '../ui/ProcessingResult';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';

export const CropRotateTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
    if (files && files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(files[0]);
      setFile(files[0]);
      setOutputUrl(null);
    }
  };

  const onLoad = (img: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = img.currentTarget;
  };

  const getCroppedImg = async () => {
    try {
      if (!imgRef.current) return;
      setIsProcessing(true);

      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      // Handle rotation manually on canvas
      const targetCtx = canvas.getContext('2d');
      if (!targetCtx) {
        throw new Error('No 2d context');
      }

      // If no crop is selected, crop whole image
      let pxCrop = completedCrop;
      if (!pxCrop || pxCrop.width === 0 || pxCrop.height === 0) {
        pxCrop = {
          x: 0,
          y: 0,
          width: imgRef.current.width,
          height: imgRef.current.height,
          unit: 'px'
        };
      }

      const pixelRatio = window.devicePixelRatio;
      
      canvas.width = Math.floor(pxCrop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(pxCrop.height * scaleY * pixelRatio);

      targetCtx.scale(pixelRatio, pixelRatio);
      targetCtx.imageSmoothingQuality = 'high';

      const cropX = pxCrop.x * scaleX;
      const cropY = pxCrop.y * scaleY;
      
      // Calculate rotation
      const centerX = imgRef.current.naturalWidth / 2;
      const centerY = imgRef.current.naturalHeight / 2;

      targetCtx.save();
      
      // Move to center of final canvas
      targetCtx.translate(-cropX, -cropY);
      targetCtx.translate(centerX, centerY);
      targetCtx.rotate((rotation * Math.PI) / 180);
      targetCtx.translate(-centerX, -centerY);
      
      targetCtx.drawImage(
        imgRef.current,
        0,
        0,
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight,
        0,
        0,
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight
      );

      targetCtx.restore();

      canvas.toBlob((blob) => {
        if (!blob) return;
        const fileName = `WorQ-Ai_Processed_${Date.now()}.png`;
        const base64Image = canvas.toDataURL('image/png', 1.0);
        
        setOutputUrl(base64Image);
        setResultFileName(fileName);
        setIsProcessing(false);

        saveFile({
          name: fileName,
          toolName: 'Crop & Rotate',
          type: `image/png`,
          size: blob.size
        }, blob);
      }, 'image/png');

    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-300">
      
      {outputUrl ? (
        <ProcessingResult 
          resultRef={resultRef}
          onDownload={handleDownload}
          onReset={() => { setFile(null); setImgSrc(''); setOutputUrl(null); }}
          title="Image Ready!"
          description="Adjustments applied successfully."
        >
          <div className="mb-6 rounded-[20px] overflow-hidden border border-[#E5E7EB] dark:border-slate-800 relative flex justify-center bg-[#F8F9FC] dark:bg-slate-900 p-2 min-h-[160px] w-full mt-4">
            <img src={outputUrl} alt="Result" className="max-w-full h-auto object-contain max-h-[220px] rounded-lg" />
          </div>
        </ProcessingResult>
      ) : (
        <div className="flex flex-col gap-4">
          {!imgSrc ? (
            <FileUploader 
              accept="image/*" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select image to process"
              subLabel="Tap to upload photo"
            />
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => { setFile(null); setImgSrc(''); }}
                  className="h-10 px-4 bg-brand-light text-brand-pink rounded-[10px] text-[13px] font-bold active:scale-95 transition-all"
                >
                  Change
                </button>
                <div className="flex-1"></div>
                <button 
                  onClick={() => setRotation(r => r + 90)}
                  className="h-10 px-4 bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#111827] dark:text-gray-200 rounded-[10px] text-[13px] font-bold active:scale-95 transition-all flex items-center gap-2"
                >
                  <MdRotateRight size={20}/> Rotate 90°
                </button>
              </div>
              
              <div className="w-full rounded-[16px] overflow-hidden border border-[#E5E7EB] dark:border-slate-800 bg-slate-950 flex items-center justify-center relative touch-none min-h-[300px]">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  className="max-h-[50vh]"
                >
                  <img
                    src={imgSrc}
                    onLoad={onLoad}
                    style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    alt="Preview"
                    className="max-h-[50vh] w-auto block pointer-events-auto"
                  />
                </ReactCrop>
              </div>
              
              <ProcessingProgressBar isProcessing={isProcessing} text="Saving adjustments..." durationMs={1000} />

              <button 
                onClick={getCroppedImg}
                disabled={isProcessing}
                className={`w-full h-[52px] ${isProcessing ? 'bg-gray-100 dark:bg-slate-800 text-gray-400' : 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20 active:scale-[0.98]'} rounded-[12px] font-bold text-[15px] transition-all flex justify-center items-center gap-2 mt-2`}
              >
                {isProcessing ? 'Saving adjustments...' : 'Apply & Save Image'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Crop & Rotate Image"
        description="Adjust image composition and orientation instantly. Focus on what matters by removing unwanted edges."
        steps={[
          "Upload your photo needing a fix.",
          "Use the cropping handles to select your new frame.",
          "Rotate or flip the image if needed for better orientation.",
          "Save your perfectly framed photo to your downloads."
        ]}
        useCases={[
          "Removing photobombers from vacation shots.",
          "Centering subjects for professional avatars.",
          "Fixing sideways photos taken on mobile.",
          "Preparing square photos for Instagram posts."
        ]}
        example={{
          input: "Wide_landscape_photo.png",
          output: "Focused_portrait_crop.png"
        }}
        seoContent="Crop and rotate image online free and fix your photo framing instantly with WorQ-Ai. This is the best crop and rotate image without losing quality tool for mobile users. Our secure crop and rotate image tool handles everything on your device, ensuring your private gallery stays private. A fast and free tool for precision photo adjustments."
        faqs={[
          { q: "Is the cropping precise?", a: "Yes, you can manually adjust the cropping box down to the pixel." },
          { q: "Can I flip the image?", a: "Yes, we support both horizontal and vertical flipping for reflection effects." },
          { q: "Does it support high resolution?", a: "Yes, we preserve as much original resolution as possible during the crop." }
        ]}
      />
    </div>
  );
};

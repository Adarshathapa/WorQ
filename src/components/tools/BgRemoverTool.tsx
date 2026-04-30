import React, { useState, useRef } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { ImageIcon, Wand2, Download, Image as ImageIcon2, Palette, SlidersHorizontal, Trash2, Upload } from 'lucide-react';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';

export const BgRemoverTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('Removing background and polishing edges...');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  
  // Editor States
  const [activeTab, setActiveTab] = useState<'background' | 'adjustments'>('background');
  const [bgType, setBgType] = useState<'transparent' | 'color' | 'gradient' | 'image'>('transparent');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [bgGradient, setBgGradient] = useState<string>('linear-gradient(to right, #ff7e5f, #feb47b)');
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

  const { saveFile } = useFileManager();
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setImageUrl(URL.createObjectURL(files[0]));
      setOutputUrl(null);
      setBgType('transparent');
      setErrorMsg('');
      setAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBgImageUrl(URL.createObjectURL(e.target.files[0]));
      setBgType('image');
      // Reset the file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg('');
    setProgressMsg('Uploading image to server...');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to remove background.');
      }
      
      const blob = await res.blob();
      const outputDataUrl = URL.createObjectURL(blob);
      setOutputUrl(outputDataUrl);
      
    } catch (err: any) {
      console.error('BG removal error:', err);
      setErrorMsg(err.message || 'Failed to process image via API.');
    } finally {
      setIsProcessing(false);
    }
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (bgType === 'color') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (bgGradient.includes('ff7e5f')) {
        grad.addColorStop(0, '#ff7e5f');
        grad.addColorStop(1, '#feb47b');
      } else if (bgGradient.includes('00c6ff')) {
        grad.addColorStop(0, '#00c6ff');
        grad.addColorStop(1, '#0072ff');
      } else if (bgGradient.includes('f12711')) {
         grad.addColorStop(0, '#f12711');
         grad.addColorStop(1, '#f5af19');
      } else {
        grad.addColorStop(0, '#8A2387');
        grad.addColorStop(0.5, '#E94057');
        grad.addColorStop(1, '#F27121');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  };

  const downloadImageResult = async () => {
    if (!outputUrl) return;
    setIsProcessing(true);
    
    try {
      const downloadName = `WorQ-Ai_Result_${Date.now()}.png`;
      const img = new Image();
      img.src = outputUrl;
      await new Promise(r => { img.onload = r; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Background
      if (bgType === 'image' && bgImageUrl) {
        const bgImg = new Image();
        bgImg.src = bgImageUrl;
        await new Promise(r => { bgImg.onload = r; });
        
        // Calculate cover cover object-fit
        const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
        const x = (canvas.width / scale - bgImg.width) / 2;
        const y = (canvas.height / scale - bgImg.height) / 2;
        
        ctx.drawImage(bgImg, x * scale, y * scale, bgImg.width * scale, bgImg.height * scale);
      } else if (bgType !== 'transparent') {
        drawBackground(ctx, canvas.width, canvas.height);
      }

      // Draw Foreground with Adjustments
      ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(blob => {
        if (!blob) return;
        saveFile({
          name: downloadName,
          toolName: 'Background Remover',
          type: `image/png`,
          size: blob.size
        }, blob);
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, 'image/png');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filterStyle = {
    filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`
  };

  const bgStyle = () => {
    if (bgType === 'transparent') {
      return { 
        backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)', 
        backgroundSize: '20px 20px', 
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        backgroundColor: '#ffffff' 
      };
    }
    if (bgType === 'color') return { backgroundColor: bgColor };
    if (bgType === 'gradient') return { background: bgGradient };
    if (bgType === 'image' && bgImageUrl) return { backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {};
  };

  const presetColors = ['#ffffff', '#000000', '#E0F2FE', '#FEF08A', '#FEE2E2', '#dcfce7'];
  const presetGradients = [
    'linear-gradient(to right, #ff7e5f, #feb47b)',
    'linear-gradient(to right, #00c6ff, #0072ff)',
    'linear-gradient(to right, #f12711, #f5af19)',
    'linear-gradient(to right, #8A2387, #E94057, #F27121)'
  ];

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-300">
      
      {outputUrl ? (
        <div className="flex flex-col animate-in zoom-in-95 duration-300 w-full max-w-4xl mx-auto">
          <h3 className="text-[20px] font-bold text-[#111827] dark:text-gray-100 mb-4 font-display tracking-tight text-center">Customize Image</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Preview Section */}
            <div className="flex flex-col">
              <div 
                className="w-full aspect-square md:aspect-[4/3] rounded-[16px] overflow-hidden border border-[#E5E7EB] dark:border-slate-800 relative flex items-center justify-center transition-all min-h-[300px] shadow-sm" 
                style={bgStyle()}
              >
                <img src={outputUrl} alt="Result" className="w-full h-full object-contain relative z-10 drop-shadow-xl" style={filterStyle} />
              </div>
            </div>

            {/* Editor Section */}
            <div className="flex flex-col h-[400px] bg-white dark:bg-slate-900 rounded-[16px] border border-[#E5E7EB] dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="flex border-b border-[#E5E7EB] dark:border-slate-800 font-display">
                <button 
                  onClick={() => setActiveTab('background')}
                  className={`flex-1 py-3.5 text-[14px] font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'background' ? 'text-brand-pink border-b-2 border-brand-pink bg-brand-light/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
                >
                  <Palette size={18} /> Background
                </button>
                <button 
                  onClick={() => setActiveTab('adjustments')}
                  className={`flex-1 py-3.5 text-[14px] font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'adjustments' ? 'text-brand-pink border-b-2 border-brand-pink bg-brand-light/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
                >
                  <SlidersHorizontal size={18} /> Adjustments
                </button>
              </div>

              <div className="p-5 flex-1 overflow-y-auto">
                {activeTab === 'background' && (
                  <div className="flex flex-col gap-6">
                    {/* Transparent Option */}
                    <div>
                      <button 
                        onClick={() => setBgType('transparent')}
                        className={`w-full py-3.5 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${bgType === 'transparent' ? 'border-brand-pink text-brand-pink bg-brand-light/10 shadow-sm' : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                      >
                        <ImageIcon2 size={18} /> Transparent Background
                      </button>
                    </div>

                    {/* Solid Colors */}
                    <div>
                      <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-3 block uppercase tracking-wider">Solid Colors</label>
                      <div className="flex flex-wrap gap-3">
                        {presetColors.map((color) => (
                          <button 
                            key={color}
                            onClick={() => { setBgType('color'); setBgColor(color); }}
                            className={`w-10 h-10 rounded-full border border-gray-200 shadow-sm transition-transform ${bgType === 'color' && bgColor === color ? 'scale-110 ring-4 ring-brand-pink/20 border-brand-pink' : 'hover:scale-105'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <div className="relative w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm flex-shrink-0">
                          <div className="absolute inset-0 pointer-events-none" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}></div>
                          <input 
                            type="color" 
                            onChange={(e) => { setBgType('color'); setBgColor(e.target.value); }}
                            className="absolute inset-[-10px] w-16 h-16 cursor-pointer opacity-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gradients */}
                    <div>
                      <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-3 block uppercase tracking-wider">Gradients</label>
                      <div className="flex flex-wrap gap-3">
                        {presetGradients.map((grad, i) => (
                          <button 
                            key={i}
                            onClick={() => { setBgType('gradient'); setBgGradient(grad); }}
                            className={`w-14 h-14 rounded-xl border border-gray-200 shadow-sm transition-transform ${bgType === 'gradient' && bgGradient === grad ? 'scale-110 ring-4 ring-brand-pink/20 border-brand-pink' : 'hover:scale-105'}`}
                            style={{ background: grad }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                       <label className="text-[13px] font-bold text-gray-900 dark:text-white mb-3 block uppercase tracking-wider">Custom Image</label>
                       <input 
                          type="file" 
                          accept="image/*" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleBgImageUpload}
                        />
                       <button 
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full py-4 rounded-xl border-2 border-dashed font-bold flex flex-col items-center justify-center gap-2 transition-all ${bgType === 'image' ? 'border-brand-pink text-brand-pink bg-brand-light/10 shadow-sm' : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300'}`}
                        >
                          <Upload size={20} className={bgType === 'image' ? 'text-brand-pink' : 'text-gray-400'} />
                          <span>Upload Background Image</span>
                       </button>
                    </div>
                  </div>
                )}

                {activeTab === 'adjustments' && (
                  <div className="flex flex-col gap-6 py-2">
                     <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[14px] font-bold text-gray-700 dark:text-gray-300">Brightness</label>
                            <span className="text-[13px] font-medium text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{adjustments.brightness}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="200" 
                            value={adjustments.brightness} 
                            onChange={(e) => setAdjustments({...adjustments, brightness: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-pink flex-1"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[14px] font-bold text-gray-700 dark:text-gray-300">Contrast</label>
                            <span className="text-[13px] font-medium text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{adjustments.contrast}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="200" 
                            value={adjustments.contrast} 
                            onChange={(e) => setAdjustments({...adjustments, contrast: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-pink flex-1"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-[14px] font-bold text-gray-700 dark:text-gray-300">Saturation</label>
                            <span className="text-[13px] font-medium text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{adjustments.saturation}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="200" 
                            value={adjustments.saturation} 
                            onChange={(e) => setAdjustments({...adjustments, saturation: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-pink flex-1"
                          />
                        </div>
                     </div>
                     <button 
                        onClick={() => setAdjustments({ brightness: 100, contrast: 100, saturation: 100 })}
                        className="mt-4 w-full py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-[14px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
                      >
                        Reset Adjustments
                      </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
            <button 
              onClick={() => { setFile(null); setImageUrl(null); setOutputUrl(null); setBgType('transparent'); }}
              disabled={isProcessing}
              className="flex-1 h-[56px] bg-white dark:bg-slate-800 border-2 border-[#E5E7EB] dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-[14px] font-bold active:scale-95 transition-all text-[15px] hover:bg-gray-50 dark:hover:bg-slate-800/70"
            >
              Start New Image
            </button>
            <button
              onClick={downloadImageResult}
              disabled={isProcessing}
              className="flex-[2] h-[56px] bg-brand-pink text-white rounded-[14px] font-bold flex justify-center items-center gap-2 shadow-xl shadow-brand-pink/20 active:scale-95 transition-all text-[16px] overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 w-full rotate-[30deg] scale-y-150 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
              {isProcessing ? 'Saving image...' : <><Download size={22} /> Download Final Image</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {!file ? (
            <FileUploader 
              accept="image/*" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select file to remove background"
              subLabel="Tap to upload an image from your device"
            />
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto w-full">
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-[16px] border border-[#E5E7EB] dark:border-slate-800 shadow-sm">
                <div className="w-[48px] h-[48px] bg-brand-light text-brand-pink rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ImageIcon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[13px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[13px] font-bold text-brand-pink hover:bg-brand-light/50 px-4 py-2 rounded-xl border border-brand-pink/20 transition-all active:scale-95">Replace</button>
              </div>
              
              <div className="w-full rounded-[16px] overflow-hidden border border-[#E5E7EB] dark:border-slate-800 bg-[#F8F9FC] dark:bg-slate-900 flex items-center justify-center min-h-[250px] p-4 shadow-sm relative">
                {imageUrl && <img src={imageUrl} alt="Preview" className="max-w-full h-auto object-contain max-h-[350px] rounded-lg shadow-md" />}
              </div>
              
              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-500/10 text-red-500 px-4 py-4 rounded-xl text-[14px] font-bold text-center border border-red-100 dark:border-red-500/20 shadow-sm">
                  {errorMsg}
                </div>
              )}

              <button 
                onClick={removeBackground}
                disabled={isProcessing}
                className="w-full h-[60px] bg-brand-pink text-white rounded-[16px] font-bold shadow-xl shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-[16px] mt-2 relative overflow-hidden group"
              >
                {!isProcessing && <div className="absolute inset-0 bg-white/20 w-full rotate-[30deg] scale-y-150 -translate-x-[150%] hover:translate-x-[150%] transition-transform duration-700"></div>}
                {isProcessing ? 'AI Model is processing...' : <><Wand2 size={24} strokeWidth={2} /> Remove Background</>}
              </button>
              
              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-4 gap-3 animate-in fade-in duration-300">
                   <div className="w-8 h-8 border-4 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin"></div>
                   <p className="text-center text-[13px] text-brand-pink dark:text-brand-pink font-bold tracking-wide">{progressMsg}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <div className="mt-8">
        <ToolGuide 
          toolName="Background Remover"
          description="Extract subjects from images instantly with AI-powered background removal, then customize with our built-in editor."
          steps={[
            "Upload your image (works best with clear subjects).",
            "Our AI automatically detects and removes the background.",
            "Use the Editor to add solid colors, gradients, or custom image backgrounds.",
            "Adjust brightness, contrast, and saturation of the subject.",
            "Download your customized image."
          ]}
          useCases={[
            "Creating product photos for E-commerce.",
            "Designing clean profile pictures for social media.",
            "Removing backgrounds for presentation headshots.",
            "Crafting digital stickers or marketing assets."
          ]}
          example={{
            input: "Photo_with_Busy_Background.jpg",
            output: "Isolated_Subject.png (Transparent or Custom BG)"
          }}
          seoContent="Remove image background online free with WorQ-Ai's advanced AI engine. This is the fastest way to remove image background without losing quality on your smartphone. Customise it adding solid colours, eye catchy gradients, image background or adjust Brightness, contrast and saturation. A completely free and instant transparent PNG generator."
          faqs={[
            { q: "Does it work on complex backgrounds?", a: "It works best when there is high contrast between the subject and the background." },
            { q: "Is the output transparent?", a: "Yes, you can export a fully transparent PNG by choosing 'Transparent Background' in the Editor." },
            { q: "Can I use it for commercial work?", a: "Absolutely! There are no restrictions on how you use the generated images." }
          ]}
        />
      </div>
      
      {/* BLOG LINK SECTION */}
      <div className="mt-4 bg-brand-pink/5 p-5 rounded-2xl border border-brand-pink/20">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-[15px]">Need more help?</h3>
        <p className="text-gray-600 dark:text-gray-300 text-[14px]">
          Read our detailed guide:{' '}
          <a 
            href="/blog/remove-background" 
            onClick={(e) => { 
              e.preventDefault(); 
              window.history.pushState({}, '', '/blog/remove-background'); 
              window.dispatchEvent(new Event('popstate')); 
            }} 
            className="text-brand-pink font-semibold hover:underline"
          >
            How to remove Background from Any Image in 1 Click
          </a>
        </p>
      </div>
    </div>
  );
};

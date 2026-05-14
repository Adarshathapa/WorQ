import React, { useState, useRef, useEffect } from 'react';
import { 
  MdInsertDriveFile, 
  MdDownload, 
  MdCompress, 
  MdSettings, 
  MdAutoFixHigh, 
  MdHistory,
  MdCheckCircle,
  MdError,
  MdCompare,
  MdChevronRight
} from 'react-icons/md';
import { FileUploader } from '../ui/FileUploader';
import { useFileManager } from '../../hooks/useFileManager';
import { RatingPrompt } from '../ui/RatingPrompt';
import { ProcessingProgressBar } from '../ui/ProcessingProgressBar';
import { motion, AnimatePresence } from 'motion/react';
import { useProcessingSuccess } from '../../hooks/useProcessingSuccess';
import JSZip from 'jszip';

interface CompressorProps {
  toolId: 'compress-pdf' | 'compress-image';
  accept: string;
  label: string;
  subLabel: string;
}

export const AdvancedCompressor: React.FC<CompressorProps> = ({ toolId, accept, label, subLabel }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  
  // Settings
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [strength, setStrength] = useState<'low' | 'balanced' | 'high'>('balanced');
  const [targetSize, setTargetSize] = useState<string>('500');
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');

  const [fileStatus, setFileStatus] = useState<Record<string, 'pending'|'processing'|'done'|'error'>>({});
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});

  const { saveFile } = useFileManager();

  const handleFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setOriginalSize(selectedFiles.reduce((acc, f) => acc + f.size, 0));
      setOutputUrl(null);
      setFileStatus({});
      setFileProgress({});
      
      // Create original preview URL only for first image
      const f = selectedFiles[0];
      if (f.type.startsWith('image/')) {
        setOriginalUrl(URL.createObjectURL(f));
      } else {
        setOriginalUrl(null);
      }
    }
  };

  const processSingleFile = async (f: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append('file', f);
    
    const settings = {
      mode,
      strength,
      targetSizeKb: mode === 'manual' ? (targetUnit === 'MB' ? parseFloat(targetSize) * 1024 : parseFloat(targetSize)) : undefined
    };
    
    formData.append('settings', JSON.stringify(settings));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    setFileStatus(prev => ({ ...prev, [f.name]: 'processing' }));
    
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 2500) * 100, 95);
      setFileProgress(prev => ({ ...prev, [f.name]: progress }));
    }, 50);

    try {
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Compression failed' }));
        setFileStatus(prev => ({ ...prev, [f.name]: 'error' }));
        throw new Error(err.error || 'Compression failed');
      }
      
      setFileProgress(prev => ({ ...prev, [f.name]: 100 }));
      setFileStatus(prev => ({ ...prev, [f.name]: 'done' }));
      return await response.blob();
    } catch (err: any) {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setFileStatus(prev => ({ ...prev, [f.name]: 'error' }));
      
      if (err.name === 'AbortError') {
        throw new Error('Compression timed out. Please try a smaller file or different settings.');
      }
      throw err;
    }
  };

  const runCompression = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      if (files.length === 1) {
        const file = files[0];
        const blob = await processSingleFile(file);
        const url = URL.createObjectURL(blob);
        const fileName = `WorQ-Ai_${toolId === 'compress-pdf' ? 'PDF' : 'Image'}_Compressed_${Date.now()}.${file.name.split('.').pop()}`;
        
        setCompressedSize(blob.size);
        setOutputUrl(url);
        setResultFileName(fileName);
        
        saveFile({
          name: fileName,
          toolName: toolId === 'compress-pdf' ? 'Compress PDF' : 'Compress Image',
          type: file.type,
          size: blob.size
        }, blob);
      } else {
        const zip = new JSZip();
        let totalCompressedSize = 0;
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const blob = await processSingleFile(file);
          totalCompressedSize += blob.size;
          zip.file(`WorQ-Ai_Compressed_${file.name}`, blob);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const fileName = `WorQ-Ai_${toolId === 'compress-pdf' ? 'PDF' : 'Image'}_Batch_Compressed_${Date.now()}.zip`;
        const url = URL.createObjectURL(zipBlob);
        
        setCompressedSize(totalCompressedSize);
        setOutputUrl(url);
        setResultFileName(fileName);
        
        saveFile({
          name: fileName,
          toolName: toolId === 'compress-pdf' ? 'Batch Compress PDF' : 'Batch Compress Image',
          type: 'application/zip',
          size: zipBlob.size
        }, zipBlob);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Error processing file(s).');
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

  const getReduction = () => {
    if (!originalSize || !compressedSize) return 0;
    return ((originalSize - compressedSize) / originalSize) * 100;
  };

  const { resultRef } = useProcessingSuccess(outputUrl, resultFileName, handleDownload);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[800px] mx-auto pb-12">
      
      {files.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <FileUploader 
            accept={accept} 
            multiple={true} 
            maxFiles={20}
            onFilesSelected={handleFiles} 
            label={label}
            subLabel={subLabel + " (Up to 20 files for batch)"}
          />
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {!outputUrl ? (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col gap-6"
            >
              {/* File Info Card (Enhanced FileUploader) */}
              <FileUploader 
                accept={accept} 
                multiple={true} 
                maxFiles={20}
                onFilesSelected={(newFiles) => {
                  setFiles(prev => {
                    const combined = [...prev, ...newFiles];
                    setOriginalSize(combined.reduce((acc, f) => acc + f.size, 0));
                    return combined.slice(0, 20); // enforce max files manually
                  });
                }} 
                label={label}
                subLabel={subLabel + " (Up to 20 files for batch)"}
                selectedFiles={files}
                onRemoveFile={(index) => {
                  setFiles(prev => {
                    const updated = prev.filter((_, i) => i !== index);
                    setOriginalSize(updated.reduce((acc, f) => acc + f.size, 0));
                    if (updated.length === 0) {
                      setOutputUrl(null);
                      setOriginalUrl(null);
                    }
                    return updated;
                  });
                }}
                fileProgress={fileProgress}
                fileStatus={fileStatus}
              />

              {/* Compression Configuration */}
              <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-[#E5E7EB] dark:border-slate-800 p-6 shadow-md shadow-black/[0.02]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                    <MdSettings size={18} />
                  </div>
                  <h3 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Compression Engine Settings</h3>
                </div>

                {/* Mode Toggles */}
                <div className="flex p-1 bg-[#F3F4F6] dark:bg-slate-800 rounded-[16px] mb-8">
                  <button 
                    onClick={() => setMode('auto')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold transition-all ${mode === 'auto' ? 'bg-white dark:bg-slate-700 text-[#111827] dark:text-white shadow-sm' : 'text-[#6B7280] dark:text-gray-400 opacity-70'}`}
                  >
                    <MdAutoFixHigh size={18} /> Automatic
                  </button>
                  <button 
                    onClick={() => setMode('manual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold transition-all ${mode === 'manual' ? 'bg-white dark:bg-slate-700 text-[#111827] dark:text-white shadow-sm' : 'text-[#6B7280] dark:text-gray-400 opacity-70'}`}
                  >
                    <MdHistory size={18} /> Manual Target
                  </button>
                </div>

                {mode === 'auto' ? (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex flex-col gap-3">
                      {(['high', 'balanced', 'low'] as const).map((lvl) => {
                        const isSelected = strength === lvl;
                        const config = {
                          high: {
                            title: 'Extreme',
                            desc: 'Maximum size reduction for sharing and storage',
                            extra: '~80% smaller',
                            color: 'text-[#F97316] bg-[#F97316]/5 border-[#F97316]/20',
                            activeColor: 'bg-[#F97316]/10 border-[#F97316] ring-4 ring-[#F97316]/10',
                            dot: 'bg-[#F97316]'
                          },
                          balanced: {
                            title: 'Smart Recommended',
                            desc: 'Optimized quality and compression balance',
                            extra: '~50% smaller',
                            color: 'text-[#10B981] bg-[#10B981]/5 border-[#10B981]/20',
                            activeColor: 'bg-[#10B981]/10 border-[#10B981] ring-4 ring-[#10B981]/10',
                            dot: 'bg-[#10B981]'
                          },
                          low: {
                            title: 'High Quality',
                            desc: 'Preserves document clarity and visuals',
                            extra: '~20% smaller',
                            color: 'text-[#374151] dark:text-gray-300 bg-[#374151]/5 dark:bg-white/5 border-[#374151]/20 dark:border-white/10',
                            activeColor: 'bg-[#374151]/10 dark:bg-white/10 border-[#374151] dark:border-white ring-4 ring-[#374151]/10 dark:ring-white/5',
                            dot: 'bg-[#374151] dark:bg-white'
                          }
                        }[lvl];

                        return (
                          <button
                            key={lvl}
                            onClick={() => setStrength(lvl)}
                            className={`flex items-center gap-4 p-4 rounded-[22px] transition-all border-2 text-left group ${
                              isSelected ? config.activeColor : 'bg-[#F9FAFB] dark:bg-slate-800/50 border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? `border-transparent ${config.dot}` : 'border-gray-300 dark:border-slate-600'}`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-[15px] font-black tracking-tight ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {config.title}
                                  {lvl === 'balanced' && <span className="ml-2 text-[10px] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-full uppercase font-black">Best</span>}
                                </p>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? config.color.split(' ')[0] : 'text-gray-400 opacity-60'}`}>
                                  {config.extra}
                                </span>
                              </div>
                              <p className={`text-[12px] font-medium leading-normal mt-0.5 ${isSelected ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                                {config.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider px-1">Enter Target File Size {files.length > 1 ? '(Per File)' : ''}</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="number"
                            value={targetSize}
                            onChange={(e) => setTargetSize(e.target.value)}
                            max={files.length === 1 ? originalSize / 1024 : undefined}
                            className="w-full h-[56px] bg-[#F9FAFB] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-800 rounded-[18px] px-5 font-bold text-[18px] text-[#111827] dark:text-white focus:border-brand-pink outline-none transition-all"
                            placeholder="e.g. 500"
                          />
                        </div>
                        <div className="flex bg-[#F3F4F6] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-800 rounded-[18px] p-1 h-[56px]">
                          {(['KB', 'MB'] as const).map(u => (
                            <button
                              key={u}
                              onClick={() => setTargetUnit(u)}
                              className={`px-4 rounded-[14px] text-[13px] font-bold transition-all ${targetUnit === u ? 'bg-white dark:bg-slate-700 text-[#111827] dark:text-white shadow-sm' : 'text-[#6B7280] dark:text-gray-400 opacity-60'}`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#6B7280] mt-1 px-1 font-medium opacity-80 italic">
                        * System will aim for this size while maintaining best possible readability.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Estimated Result Section */}
              <div className="bg-brand-pink/5 border border-brand-pink/10 rounded-[22px] p-5 animate-in fade-in slide-in-from-top-1 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-black text-brand-pink uppercase tracking-widest">Target Estimation</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-pink/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
                    <span className="text-[10px] font-black text-brand-pink uppercase tracking-tighter">Live calculation</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-8">
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Current</p>
                    <p className="text-[20px] font-bold text-[#111827] dark:text-white tracking-tight">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center text-brand-pink">
                      <MdChevronRight size={20} />
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-[11px] font-bold text-brand-pink uppercase tracking-wider mb-1">Estimated</p>
                    <p className="text-[20px] font-black text-brand-pink tracking-tight">
                      {mode === 'manual' 
                        ? `${(targetUnit === 'MB' ? parseFloat(targetSize) : parseFloat(targetSize) / 1024).toFixed(2)} MB`
                        : `${((originalSize / 1024 / 1024) * (strength === 'high' ? 0.2 : strength === 'balanced' ? 0.5 : 0.8)).toFixed(2)} MB`
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-brand-pink/10 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400 italic">Expected quality retention:</span>
                  <span className="text-[13px] font-black text-brand-pink">
                    {strength === 'high' ? '60% (Fair)' : strength === 'balanced' ? '92% (Excellent)' : '98%+ (Lossless)'}
                  </span>
                </div>
              </div>

              <ProcessingProgressBar isProcessing={isProcessing} text="Analyzing Document..." durationMs={2500} />

              <button 
                onClick={runCompression}
                disabled={isProcessing}
                className={`w-full h-[64px] rounded-[22px] font-black text-[17px] tracking-tight transition-all flex justify-center items-center gap-3 active:scale-[0.97] disabled:opacity-50 ${
                  isProcessing 
                  ? 'bg-[#F3F4F6] dark:bg-slate-800 text-[#9CA3AF]' 
                  : 'bg-brand-pink text-white shadow-xl shadow-brand-pink/30 hover:shadow-brand-pink/40 hover:-translate-y-0.5'
                }`}
              >
                {isProcessing ? 'Optimizing File...' : (
                  <>
                    <span>Compress Now</span>
                    <MdChevronRight size={24} />
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div 
               key="result"
               ref={resultRef}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col gap-6"
            >
               {/* Result Card Hero */}
               <div className="bg-white dark:bg-slate-900 rounded-[32px] border-2 border-brand-pink/5 overflow-hidden shadow-xl shadow-black/[0.03]">
                  <div className="bg-gradient-to-br from-brand-pink to-[#FF8A3D] p-8 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                      <MdCheckCircle size={32} />
                    </div>
                    <h2 className="text-[24px] font-black tracking-tight mb-2">Compression Successful</h2>
                    <p className="text-white/80 font-medium text-[15px]">{files.length > 1 ? `All ${files.length} files are optimized and ready for download in a ZIP.` : 'The file is now optimized and ready for download.'}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-[#F9FAFB] dark:bg-slate-800/50 p-6 rounded-[24px] text-center border border-gray-100 dark:border-white/[0.03]">
                         <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-widest mb-2 opacity-60">Original Size</p>
                         <p className="text-[20px] font-bold text-[#111827] dark:text-gray-300 line-through decoration-brand-pink/30 tracking-tight">
                           {(originalSize / 1024 / 1024).toFixed(2)} MB
                         </p>
                      </div>
                      <div className="bg-brand-pink/5 p-6 rounded-[24px] text-center border border-brand-pink/10">
                         <p className="text-[11px] font-black text-brand-pink uppercase tracking-widest mb-2">Compressed Size</p>
                         <p className="text-[24px] font-black text-[#111827] dark:text-white tracking-tight">
                           {(compressedSize / 1024 / 1024).toFixed(2)} MB
                         </p>
                      </div>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="space-y-4 mb-8">
                       <div className="flex justify-between items-end">
                         <div>
                            <span className="text-[10px] font-black text-brand-pink uppercase tracking-widest bg-brand-pink/10 px-2 py-0.5 rounded-full">Massive Reduction</span>
                            <h4 className="text-[28px] font-black text-gray-900 dark:text-white mt-1 leading-none">{getReduction().toFixed(1)}%</h4>
                         </div>
                         <div className="text-right">
                           <p className="text-[12px] font-bold text-[#6B7280]">Quality Level: <span className="text-green-500">High</span></p>
                           <p className="text-[11px] font-medium text-[#9CA3AF]">~98% Retained</p>
                         </div>
                       </div>
                       <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                         <div 
                           className="h-full bg-gradient-to-r from-brand-pink to-[#FF8A3D] rounded-full transition-all duration-1000" 
                           style={{ width: `${getReduction()}%` }} 
                         />
                       </div>
                       <p className="text-[12px] text-[#6B7280] dark:text-gray-400 font-medium text-center">Optimized for fast web loading and email compatibility.</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleDownload}
                        className="w-full h-[64px] bg-brand-pink text-white rounded-[22px] font-black text-[17px] flex items-center justify-center gap-2 shadow-xl shadow-brand-pink/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <MdDownload size={24} /> {files.length > 1 ? 'Download Batch ZIP' : 'Download Optimized File'}
                      </button>
                      <button 
                        onClick={() => { setFiles([]); setOutputUrl(null); }}
                        className="w-full h-[56px] text-[#6B7280] dark:text-gray-400 rounded-[22px] font-bold active:scale-95 transition-all text-[14px] hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        Compress More Files
                      </button>
                    </div>
                  </div>
               </div>
               
               {/* Preview Section */}
               <div className="mt-4">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <MdCompare className="text-brand-pink" size={20} />
                    <h3 className="text-[17px] font-black text-gray-900 dark:text-white tracking-tight">Quality Audit Preview {files.length > 1 ? '(First File)' : ''}</h3>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-[#E5E7EB] dark:border-slate-800 p-2 overflow-hidden aspect-video relative group">
                    {toolId === 'compress-image' && originalUrl && outputUrl && files.length === 1 ? (
                      <ComparisonSlider 
                        before={originalUrl} 
                        after={outputUrl} 
                      />
                    ) : toolId === 'compress-pdf' && outputUrl && files.length === 1 ? (
                      <div className="w-full h-full rounded-[20px] overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
                         <iframe src={outputUrl} className="w-full h-full border-none" title="PDF Preview" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-[13px] font-medium bg-gray-50 dark:bg-slate-800 rounded-[20px]">
                        Preview not available for batch processing. Download the ZIP to view all files.
                      </div>
                    )}
                  </div>
               </div>

               {RatingPrompt && <div className="mt-8"><RatingPrompt /></div>}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const ComparisonSlider: React.FC<{ before: string, after: string }> = ({ before, after }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-col-resize select-none overflow-hidden touch-none rounded-[20px]"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <img src={before} className="absolute inset-0 w-full h-full object-contain" alt="Original" />
      <div 
        className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.2)]"
        style={{ width: `${position}%` }}
      >
        <img src={after} className="absolute inset-0 w-full h-full scale-[1] object-contain" style={{ width: `${10000 / position}%` }} alt="Compressed" />
        <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase backdrop-blur-sm">After</div>
      </div>
      <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase backdrop-blur-sm">Before</div>
      
      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-brand-pink ring-4 ring-[#FF8A3D]/20">
          <MdCompare size={20} />
        </div>
      </div>
    </div>
  );
};

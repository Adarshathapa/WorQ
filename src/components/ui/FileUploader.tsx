import React, { useRef, useState, useCallback } from 'react';
import { CloudUpload, Lock, Upload, File as FileIcon, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  subLabel?: string;
  
  // Optional enhancements for batch processing
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  fileProgress?: Record<string, number>; // 0 to 100
  fileStatus?: Record<string, 'pending' | 'processing' | 'done' | 'error'>;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  accept, 
  multiple = false, 
  maxFiles, 
  label = 'Drag & Drop your files here',
  subLabel,
  selectedFiles = [],
  onRemoveFile,
  fileProgress = {},
  fileStatus = {}
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleFiles = (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (files.length === 0) return;
    
    if (maxFiles && files.length > maxFiles) {
      onFilesSelected(files.slice(0, maxFiles));
    } else {
      onFilesSelected(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const defaultSubLabel = subLabel || (multiple ? 'Select multiple files to begin' : 'Select a file to begin');

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col w-full relative group z-20 max-w-[800px] mx-auto mb-8 sm:mb-12">
      <div 
        className={`w-full ${selectedFiles.length > 0 ? 'min-h-[140px] sm:min-h-[160px]' : 'min-h-[260px] sm:min-h-[340px]'} rounded-[32px] border-[3px] border-dashed flex flex-col items-center justify-center text-center px-6 transition-all duration-300 cursor-pointer relative overflow-hidden bg-white/50 backdrop-blur-sm
          ${isDragging 
            ? 'border-[#FF8A3D] bg-[#FF8A3D]/5 scale-[1.02] shadow-[0_32px_64px_rgba(255,138,61,0.15)] ring-4 ring-[#FF8A3D]/20 ring-offset-4' 
            : 'border-orange-200/50 hover:border-[#FF8A3D] hover:bg-[#FF8A3D]/[0.02] hover:shadow-[0_20px_48px_rgba(255,138,61,0.1)] shadow-[0_8px_24px_rgba(0,0,0,0.02)]'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-[#FF8A3D]/5 opacity-0 transition-opacity duration-300 pointer-events-none ${isDragging ? 'opacity-100' : 'group-hover:opacity-100'}`} />

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          multiple={multiple} 
          className="hidden" 
        />
        
        <div className="relative z-10 flex flex-col items-center flex-1 justify-center py-6 w-full h-full">
          {selectedFiles.length === 0 ? (
            <>
              {/* Animated Icon Container for empty state */}
              <div className="relative mb-6 sm:mb-8">
                <div className={`absolute inset-0 bg-[#FF8A3D] rounded-full blur-[32px] transition-all duration-500 ease-out 
                  ${isDragging ? 'opacity-50 scale-[1.8]' : 'opacity-20 scale-125 group-hover:scale-[1.5] group-hover:opacity-40'}`} 
                />
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[22px] bg-gradient-to-br from-[#FF8A3D] to-[#FF7A18] text-white flex items-center justify-center relative z-10 shadow-xl transition-all duration-500 border border-white/20
                  ${isDragging ? 'scale-110 -translate-y-2' : 'group-hover:scale-105 group-hover:-translate-y-1'}
                `}>
                  <CloudUpload size={40} strokeWidth={2} className={`${isDragging ? 'animate-bounce' : ''}`} />
                </div>
                
                {/* Decorative small icons */}
                <div className={`absolute -right-4 -top-2 w-10 h-10 rounded-[14px] bg-white border border-gray-100 shadow-lg flex items-center justify-center text-[#FF8A3D] transition-all duration-500 z-20 
                  ${isDragging ? 'opacity-0 translate-x-4' : 'opacity-100 group-hover:translate-x-3 group-hover:-translate-y-3'}`}>
                  <FileIcon size={18} />
                </div>
                <div className={`absolute -left-4 bottom-0 w-8 h-8 rounded-[12px] bg-white border border-gray-100 shadow-md flex items-center justify-center text-[#FF8A3D] transition-all duration-500 z-20 delay-75
                  ${isDragging ? 'opacity-0 -translate-x-4' : 'opacity-100 group-hover:-translate-x-3 group-hover:translate-y-2'}`}>
                  <Upload size={14} />
                </div>
              </div>
              
              <div className="flex flex-col gap-3 items-center pointer-events-none">
                <h3 className="text-[24px] md:text-[32px] font-black text-[#111827] font-display tracking-tight drop-shadow-sm transition-all duration-300">
                  {isDragging ? 'Drop files now...' : label}
                </h3>
                <p className="text-[16px] sm:text-[18px] text-[#6B7280] font-medium max-w-[300px] transition-all duration-300">
                  {isDragging ? 'Release to begin processing' : defaultSubLabel}
                </p>
                {!isDragging && (
                   <div className="mt-2 bg-[#FF8A3D] text-white rounded-full px-8 py-3 border border-orange-400 shadow-md shadow-orange-500/20 font-semibold transition-all transform group-hover:scale-105 group-hover:bg-[#FF7A18] group-hover:shadow-lg group-hover:shadow-orange-500/30 group-active:scale-95 pointer-events-auto flex items-center justify-center gap-2">
                     Choose Files
                   </div>
                )}
              </div>
            </>
          ) : (
            // Compact view when files are already selected
            <div className="flex items-center gap-4 text-[#6B7280] flex-col sm:flex-row pointer-events-none">
              <div className="w-12 h-12 bg-[#FF8A3D]/10 rounded-full flex items-center justify-center text-[#FF8A3D]">
                <CloudUpload size={24} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[16px] font-bold text-[#111827]">{isDragging ? 'Drop to add more' : 'Add more files'}</p>
                <p className="text-[13px] font-medium opacity-80">Click or drag & drop</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RENDER SELECTED FILES WITH PROGRESS */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 w-full flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 mb-1">
             <h4 className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Queue ({selectedFiles.length})</h4>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[24px] overflow-hidden shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
            {selectedFiles.map((f, i) => {
              const status = fileStatus[f.name] || 'pending';
              const progress = fileProgress[f.name] || 0;
              
              const isProcessing = status === 'processing';
              const isDone = status === 'done';
              const isError = status === 'error';
              
              return (
                <div key={`${f.name}-${i}`} className="p-4 flex flex-col gap-3 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors relative overflow-hidden">
                  
                  {/* Progress Background Fill */}
                  {isProcessing && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-brand-pink/5 transition-all duration-300 ease-out z-0" 
                      style={{ width: `${progress}%` }} 
                    />
                  )}
                  {isDone && (
                    <div className="absolute inset-0 bg-green-500/5 z-0" />
                  )}
                  
                  <div className="flex items-center justify-between gap-4 z-10 relative">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-sm transition-colors border
                        ${isDone ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:border-green-500/20' : 
                          isError ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:border-red-500/20' : 
                          isProcessing ? 'bg-brand-pink/10 text-brand-pink border-brand-pink/20' : 
                          'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700'}`}>
                        {isDone ? <CheckCircle2 size={20} /> : 
                         isError ? <AlertCircle size={20} /> : 
                         isProcessing ? <Loader2 size={20} className="animate-spin" /> : 
                         <FileIcon size={20} />}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className={`text-[14px] font-bold truncate transition-colors ${isDone ? 'text-green-700 dark:text-green-400' : isError ? 'text-red-700 dark:text-red-400' : 'text-[#111827] dark:text-white'}`}>
                          {f.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[12px] font-medium text-[#6B7280]">{formatSize(f.size)}</span>
                          {isProcessing && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600" />
                              <span className="text-[12px] font-bold text-brand-pink">{Math.round(progress)}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <div className="flex-shrink-0">
                      {status === 'pending' || status === 'error' ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRemoveFile?.(i); }} 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          title="Remove file"
                        >
                          <X size={18} />
                        </button>
                      ) : (
                        <span className={`text-[12px] font-bold uppercase tracking-wider px-2 py-1 rounded-md
                          ${isDone ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-500/10' : 
                            'text-brand-pink bg-brand-pink/10'}`}>
                          {isDone ? 'Finished' : 'Processing'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Slim Progress Bar */}
                  {isProcessing && (
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1 z-10 relative">
                      <div 
                        className="h-full bg-brand-pink rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {selectedFiles.length === 0 && (
        <div className="flex items-center justify-center gap-2.5 mt-5 px-4 py-3 bg-[#E8F5E9]/50 w-max mx-auto rounded-full border border-green-100">
          <Lock size={16} className="text-emerald-500 shrink-0" />
          <span className="text-[14px] sm:text-[15px] text-[#4B5563] font-medium text-center tracking-wide">
            Your file stays on your device. <strong className="text-emerald-700">No upload.</strong>
          </span>
        </div>
      )}
    </div>
  );
};

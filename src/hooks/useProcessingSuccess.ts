import { useEffect, useRef } from 'react';
import { openSmartLinkAd } from '../utils/adRedirect';

export const useProcessingSuccess = (outputUrl: string | null, fileName: string, autoDownloadFn?: () => void) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!outputUrl) {
      lastProcessedUrl.current = null;
    } else if (outputUrl && outputUrl !== lastProcessedUrl.current) {
      lastProcessedUrl.current = outputUrl;

      // 1. Auto Download
      if (autoDownloadFn) {
        autoDownloadFn();
      } else {
        const a = document.createElement('a');
        a.href = outputUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Open Smart Link Ad after download
      openSmartLinkAd();

      // 2. Auto Scroll to Result Section smoothly
      scrollTimeoutRef.current = setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    }
  }, [outputUrl, fileName, autoDownloadFn]);

  return { resultRef };
};

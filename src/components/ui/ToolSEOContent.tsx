import React from 'react';
import { ToolItem } from '../../types';

interface ToolSEOContentProps {
  tool: ToolItem;
}

export const ToolSEOContent: React.FC<ToolSEOContentProps> = ({ tool }) => {
  return (
    <div className="mt-16 w-full max-w-[800px] mx-auto opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex flex-col gap-6 text-[#4B5563] dark:text-gray-400">
        
        {/* Main SEO Text Block */}
        <section className="bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-[24px] font-black font-display text-[#111827] dark:text-white mb-4">
            How to Use the Free {tool.name} Tool
          </h2>
          <p className="mb-4 text-[15px] leading-relaxed">
            Our <strong>free {tool.name.toLowerCase()} tool</strong> is designed to help you process your files securely and efficiently. Whether you need to manage your documents, optimize images, or convert complex file formats, this tool provides a seamless online experience without any registration required.
          </p>
          <p className="text-[15px] leading-relaxed">
            With WorQ-AI's advanced processing engine, you can edit your files quickly right from your browser. We prioritize your privacy—most processing happens entirely in your browser or your files are immediately deleted from our servers after the process completes. Use our <strong>{tool.name.toLowerCase()}</strong> to enhance your workflow and save time today.
          </p>
        </section>

        {/* FAQs Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[24px] p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-[24px] font-black font-display text-[#111827] dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-[16px] text-[#111827] dark:text-white">Is this {tool.name.toLowerCase()} tool completely free to use?</h3>
              <p className="text-[14px]">Yes! You can use our {tool.name.toLowerCase()} features completely free of charge with no hidden fees or watermarks.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-[16px] text-[#111827] dark:text-white">Are my files safe and secure?</h3>
              <p className="text-[14px]">Security is our top priority. Files are processed securely. When uploaded, they are transferred via HTTPS and permanently deleted from our servers right after processing. We don't store or share your data.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-[16px] text-[#111827] dark:text-white">Do I need to install any software?</h3>
              <p className="text-[14px]">No software installation is required. This is a web-based utility that works perfectly on Windows, Mac, Linux, and mobile devices right out of the box.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-[16px] text-[#111827] dark:text-white">Can I use this tool on my mobile phone?</h3>
              <p className="text-[14px]">Absolutely. Our platform is fully responsive and optimized for mobile devices, allowing you to manage your files on the go.</p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
};

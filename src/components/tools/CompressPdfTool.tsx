import React from 'react';
import { AdvancedCompressor } from './AdvancedCompressor';
import { ToolGuide } from '../ui/ToolGuide';

export const CompressPdfTool: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <AdvancedCompressor 
        toolId="compress-pdf"
        accept="application/pdf,.docx,.pptx,.xlsx"
        label="Select Document to Compress"
        subLabel="Support for PDF, DOCX, PPTX & XLSX"
      />

      <ToolGuide 
        toolName="Document Compressor"
        description="Our advanced multi-format optimization engine uses intelligent media stream extraction to reduce file sizes significantly while preserving layout, fonts, and pixel-perfect quality."
        steps={[
          "Upload your document securely to our encrypted server.",
          "Select Auto mode for instant optimization or Manual for specific targets.",
          "Our AI engine processes images and font streams recursively.",
          "Download your polished, lightweight document instantly."
        ]}
        useCases={[
          "Shrinking large business proposals for client emails.",
          "Optimizing scanned records for long-term secure storage.",
          "Reducing ebook sizes for mobile reading compatibility.",
          "Meeting strict upload limits on government and portal sites."
        ]}
        example={{
          input: "Quarterly_Audit_35MB.pdf",
          output: "Optimized_Audit_4.2MB.pdf"
        }}
        seoContent="The best PDF compressor online. Reduce PDF size with WorQ-Ai's intelligent engine. Unlike generic tools, we preserve vector text and optimize font streams, ensuring your documents look perfect even at 90% reduction. High-speed, secure, and mobile-optimized document compression."
        faqs={[
          { q: "Is the compression lossy?", a: "We use visually lossless optimization for text and high-quality downsampling for images to ensure your document remains professional." },
          { q: "Can I target a specific file size?", a: "Yes! Use our Target Size Engine to specify exactly how many KB or MB you need your final file to be." },
          { q: "Is my data stored on the server?", a: "No, files are processed in-memory and automatically purged immediately after your session ends." }
        ]}
      />
    </div>
  );
};


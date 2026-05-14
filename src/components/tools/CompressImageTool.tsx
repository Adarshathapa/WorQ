import React from 'react';
import { AdvancedCompressor } from './AdvancedCompressor';
import { ToolGuide } from '../ui/ToolGuide';

export const CompressImageTool: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <AdvancedCompressor 
        toolId="compress-image"
        accept="image/*"
        label="Select Image to Compress"
        subLabel="Smart optimization for PNG, JPG, & WebP"
      />

      <ToolGuide 
        toolName="Image Optimizer"
        description="Our high-fidelity image compression engine uses advanced Sharp/MozJPEG algorithms to reduce file sizes by up to 90% without any perceptible loss in quality. Perfect for photographers and web developers."
        steps={[
          "Upload your high-resolution high-res image to our secure processor.",
          "Choose Automatic for smart AI compression or Manual for strict target sizes.",
          "View the side-by-side quality comparison audit.",
          "Download your pristine yet lightweight image instantly."
        ]}
        useCases={[
          "Speeding up website load times with optimized assets.",
          "Compressing large DSLR photos for social media sharing.",
          "Reducing mobile storage usage without deleting memories.",
          "Ensuring email attachments stay under size limits."
        ]}
        example={{
          input: "Product_Shoot_12MB.jpg",
          output: "Optimized_Web_850KB.jpg"
        }}
        seoContent="The ultimate image compressor for professionals. WorQ-Ai delivers smarter compression than generic web tools. Achieve massive size reduction in seconds while maintaining perfect color accuracy and sharpness. Secure, fast, and optimized for high-performance web experiences."
        faqs={[
          { q: "Is PNG transparency preserved?", a: "Yes, our algorithm handles alpha channels perfectly, ensuring your transparent backgrounds remain intact." },
          { q: "What's the best compression level?", a: 'We recommend "Balanced" for the best trade-off between file size and professional visual fidelity.' },
          { q: "How does Manual mode work?", a: "Enter your desired file size (e.g., 200KB), and our engine will perform multiple optimized passes to reach that target." }
        ]}
      />
    </div>
  );
};


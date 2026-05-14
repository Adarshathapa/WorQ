import React from 'react';
import { HelpCircle, Info, MessageSquare, Lightbulb, CheckCircle2, Check, ArrowDown, FileCheck, File, FileText, Image as ImageIcon, Zap, Lock, Smartphone, FileType2 } from 'lucide-react';

interface ToolGuideProps {
  toolName: string;
  description: string;
  steps: string[];
  useCases: string[];
  example: { input: string; output: string };
  seoContent?: React.ReactNode;
  seoBlocks?: {
    icon: React.ReactNode;
    title: string;
    text: string;
  }[];
  faqs: { q: string; a: string }[];
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return <FileText size={16} className="text-red-400" />;
    case 'jpg':
    case 'png': return <ImageIcon size={16} className="text-blue-400" />;
    case 'docx':
    case 'doc': return <FileText size={16} className="text-blue-500" />;
    default: return <File size={16} className="text-gray-400" />;
  }
};

export const ToolGuide: React.FC<ToolGuideProps> = ({
  toolName,
  description,
  steps,
  useCases,
  example,
  seoContent,
  seoBlocks,
  faqs
}) => {
  return (
    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-10 sm:gap-14 animate-in fade-in duration-700 pb-16 w-full max-w-[1000px] mx-auto">
      
      {/* Short Description */}
      <section className="text-center max-w-[800px] mx-auto px-2">
        <h2 className="text-[28px] sm:text-[32px] md:text-[40px] font-black text-[#111827] mb-4 font-display tracking-tight">{toolName}</h2>
        <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#6B7280] leading-relaxed font-medium px-4">
          {description}
        </p>
      </section>

      {/* How it Works - Vertical Timeline Steps */}
      <section className="bg-[#F8FAFC]/50 rounded-[28px] p-6 sm:p-10 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="w-12 h-12 rounded-[16px] bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center shrink-0">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-extrabold text-[#111827] font-display">How it Works</h3>
        </div>
        
        <div className="flex flex-col gap-0 relative px-2 sm:px-4">
          {/* Vertical connecting line */}
          <div className="absolute left-[26px] sm:left-[34px] top-6 bottom-6 w-0.5 bg-orange-100/50 hidden sm:block" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-row items-start gap-4 sm:gap-6 p-4 sm:p-5 relative group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#FF8A3D] font-black flex items-center justify-center shrink-0 shadow-sm border border-orange-100 z-10 transition-all group-hover:scale-110 group-hover:bg-[#FF8A3D] group-hover:text-white group-hover:border-[#FF8A3D] text-[16px] sm:text-[18px]">
                {idx + 1}
              </div>
              <div className="flex flex-col flex-1 pt-2 sm:pt-2.5">
                <p className="text-[16px] sm:text-[18px] text-[#4B5563] font-medium leading-relaxed group-hover:text-[#111827] transition-colors">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases - Standalone Grid */}
      <div className="w-full mx-0">
        <section className="w-full">
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Info className="text-blue-500" size={20} />
            </div>
            <h3 className="text-[20px] sm:text-[24px] font-extrabold text-[#111827]">Common Use Cases</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {useCases.map((useCase, idx) => (
              <li key={idx} className="text-[15px] sm:text-[16px] text-[#4B5563] flex items-start gap-3 font-medium bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <span className="leading-relaxed">{useCase}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* LONG SEO Content Block - Moved up somewhat */}
      {seoBlocks ? (
        <section className="w-full mt-6">
          <div className="bg-white rounded-[32px] p-6 sm:p-10 md:p-14 border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full pointer-events-none opacity-60" />
            
            <div className="text-center mb-10 sm:mb-16 relative z-10">
              <span className="bg-[#FFF4ED] text-[#FF8A3D] font-bold text-[13px] sm:text-[14px] px-5 py-2 rounded-full tracking-wider uppercase mb-4 inline-flex items-center shadow-sm border border-orange-100">Why Choose WorQ-AI</span>
              <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-black text-[#111827] font-display tracking-tight leading-tight mt-2">Fast, Secure & Professional<br className="hidden md:block"/> File Processing</h2>
              <p className="text-[16px] sm:text-[18px] text-[#4B5563] mt-5 max-w-[650px] mx-auto font-medium leading-relaxed">Experience the most advanced browser-based document utilities without compromising your privacy or workflow speed.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 relative z-10">
              {seoBlocks.map((block, i) => (
                <div key={i} className="flex flex-col gap-4 sm:gap-5 p-6 sm:p-8 bg-[#F8FAFC]/60 rounded-[28px] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:bg-white hover:border-gray-200 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-[18px] bg-white border border-gray-100 text-[#FF8A3D] flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {block.icon}
                  </div>
                  <h3 className="text-[20px] sm:text-[22px] font-black text-[#111827] font-display tracking-tight">{block.title}</h3>
                  <p className="text-[16px] sm:text-[17px] text-[#4B5563] leading-relaxed font-medium">{block.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : seoContent ? (
        <section className="px-6 sm:px-10 py-10 bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="prose prose-gray max-w-none prose-p:text-[16px] sm:prose-p:text-[18px] prose-p:leading-relaxed prose-p:text-[#4B5563] prose-headings:text-[#111827] prose-headings:font-display prose-headings:font-black">
            {seoContent}
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      <section className="px-2 sm:px-0 w-full max-w-[800px] mx-auto mt-4 sm:mt-6">
        <div className="flex flex-col items-center gap-3 mb-10 text-center">
          <div className="w-14 h-14 rounded-[20px] bg-purple-50 text-purple-500 flex items-center justify-center mb-2 shadow-sm border border-purple-100">
            <MessageSquare size={28} />
          </div>
          <h3 className="text-[28px] sm:text-[32px] md:text-[36px] font-black text-[#111827] font-display tracking-tight">Frequently Asked Questions</h3>
          <p className="text-[#6B7280] text-[16px] sm:text-[18px] font-medium">Everything you need to know about this tool.</p>
        </div>
        <div className="grid gap-4 sm:gap-5 px-2 sm:px-0">
          {faqs.map((faq, idx) => (
            <div key={idx} className="flex flex-col gap-3 bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 hover:border-gray-200 transition-all shadow-sm hover:shadow-md cursor-default group">
              <h4 className="text-[16px] sm:text-[18px] font-extrabold text-[#111827] flex items-start gap-3 group-hover:text-[#FF8A3D] transition-colors">
                <span className="text-[#FF8A3D] mt-0.5">Q.</span> <span className="leading-snug">{faq.q}</span>
              </h4>
              <p className="text-[15px] sm:text-[16px] text-[#4B5563] leading-relaxed pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

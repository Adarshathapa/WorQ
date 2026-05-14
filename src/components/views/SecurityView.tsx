import React from 'react';
import { SEO } from '../ui/SEO';
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const SecurityView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
      <SEO 
        title="Security & Trust - WorQ-Ai" 
        description="Learn how WorQ-Ai secures your documents and data using local browser processing."
      />
      
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security & Trust</h1>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          We built WorQ-Ai from the ground up with data security and user privacy as our core principles.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600">
            <Lock className="text-brand-pink mb-4" size={24} />
            <h3 className="font-bold text-lg mb-2">Local Processing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Most of our tools run directly in your browser. This means your files never upload to our servers—they stay completely on your device.</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600">
            <EyeOff className="text-brand-pink mb-4" size={24} />
            <h3 className="font-bold text-lg mb-2">No Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">We don't inspect, read, or catalog the documents you process. Your business and personal documents remain your private business.</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-xl font-bold mt-8 mb-4">What happens when files are processed on the server?</h2>
          <p>
            For tools that require intense computing power (like OCR or complex AI generation), your files are sent over an encrypted HTTPS connection. Once the process completes, the output is directly sent back to you, and the original files are purged from our servers immediately. We keep no backups or logs of your file contents.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Encryption</h2>
          <p>
            All data transfers between your browser and our infrastructure use modern TLS/SSL encryption. This ensures that no third party can intercept or read your data in transit.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Ongoing Audits</h2>
          <p>
            We are continuously monitoring our infrastructure for vulnerabilities. Dependencies are updated regularly and security practices are reviewed consistently to ensure your data stays safe.
          </p>
        </div>
      </div>
    </div>
  );
};

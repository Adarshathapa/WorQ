import React from 'react';
import { SEO } from '../ui/SEO';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicyView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
      <SEO 
        title="Privacy Policy - WorQ-Ai" 
        description="Learn about how WorQ-Ai collects, uses, and protects your privacy and personal data."
      />
      
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            At WorQ-Ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our tools.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you manually provide us, as well as automatically collected data when you use the website.
          </p>
          <ul className="list-disc pl-5 mb-6">
            <li><strong>Files and Data:</strong> Files you upload for conversion or processing. Most processing occurs entirely in your browser. Any files processed on our servers are immediately deleted after processing.</li>
            <li><strong>Usage Data:</strong> Information about your interactions with our app, such as tools used and preferences.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the collected information for various purposes, including:
          </p>
          <ul className="list-disc pl-5 mb-6">
            <li>To provide, operate, and maintain our tools.</li>
            <li>To improve, personalize, and expand our application.</li>
            <li>To understand and analyze how you use our platform.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement sensible security measures to protect your data. For many of our tools, the process happens exclusively locally in your browser, meaning your data never even leaves your device.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            We may use third-party services for analytics or processing (e.g., Google Analytics, advertising partners). These third parties have their own privacy policies addressing how they use such information.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us via our website.
          </p>
        </div>
      </div>
    </div>
  );
};

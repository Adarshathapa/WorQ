import React from 'react';
import { SEO } from '../ui/SEO';
import { ArrowLeft } from 'lucide-react';

export const TermsOfServiceView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
      <SEO 
        title="Terms of Service - WorQ-Ai" 
        description="Read the terms of service and conditions for using WorQ-Ai tools."
      />
      
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Welcome to WorQ-Ai. These Terms of Service govern your use of our website and tools.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using WorQ-Ai, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use the materials and tools on WorQ-Ai's website for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Prohibited Uses</h2>
          <p>
            You agree not to use the application in any way that violates any applicable national or international law or regulation. You also agree not to:
          </p>
          <ul className="list-disc pl-5 mb-6">
            <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
            <li>Use the Service in any manner that could disable, overburden, damage, or impair the site.</li>
            <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Privacy</h2>
          <p>
            Your use of the Service is also subject to our Privacy Policy.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Disclaimer</h2>
          <p>
            The materials on WorQ-Ai's website are provided on an 'as is' basis. WorQ-Ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </div>
      </div>
    </div>
  );
};

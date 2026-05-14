import React from 'react';
import { SEO } from '../ui/SEO';
import { ArrowLeft, Rocket, Heart, Users } from 'lucide-react';

export const AboutUsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-300">
      <SEO 
        title="About Us - WorQ-Ai" 
        description="Learn more about WorQ-Ai, our mission, and the team behind the ultimate productivity toolkit."
      />
      
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-light text-brand-pink rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Rocket size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About WorQ-Ai</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We are building the most accessible, fast, and secure toolkit for your everyday file and document needs.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-[#FF8A3D]" /> Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Our mission is to empower professionals, students, and everyday users to be more productive. We believe that simple software should be free and accessible to everyone, without compromising on privacy, security, or design. We built WorQ-Ai because we were tired of tools that bombarded users with intrusive ads or required expensive subscriptions for basic features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Heart className="text-[#FF8A3D]" /> Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600">
                <h3 className="font-bold text-lg mb-2">Privacy First</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">We prioritize tools that run entirely locally in your browser. When cloud computing is needed, we ensure your data is instantly deleted.</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600">
                <h3 className="font-bold text-lg mb-2">Accessibility</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Great software shouldn't be locked behind high paywalls. We keep essential tools free and easy to use on any device.</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600">
                <h3 className="font-bold text-lg mb-2">Speed & Quality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">We write clean, efficient code so your files convert and process blazing fast, saving you precious time.</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600">
                <h3 className="font-bold text-lg mb-2">Continuous Improvement</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">We are always taking user feedback and iterating our tools. We want to be the toolkit you rely on every day.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  name?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  type = 'website',
  name = 'WorQ-AI',
  image = 'https://worq-ai.in/og-image.png',
}) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : '';
  const finalCanonical = canonical || `https://worq-ai.in${currentPath || '/'}`;
  const siteTitle = title ? `${title} | ${name}` : 'Free PDF Tools Online | WorQ-AI';
  const siteDescription = description || 'All-in-one free PDF tools. Merge, compress, convert PDFs online. Fast and secure.';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}

      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={image} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

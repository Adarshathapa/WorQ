import React from 'react';

export const NativeAd: React.FC = () => {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background: transparent;
          }
        </style>
      </head>
      <body>
        <script async="async" data-cfasync="false" src="https://pl29373354.profitablecpmratenetwork.com/3c3ff12589be4e0c4e0301a16fa5aa33/invoke.js"></script>
        <div id="container-3c3ff12589be4e0c4e0301a16fa5aa33"></div>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex items-center justify-center bg-transparent border-none overflow-hidden min-h-[250px]">
      <iframe
        title="Native Advertisement"
        width="100%"
        height="250"
        frameBorder={0}
        scrolling="no"
        srcDoc={adHtml}
        className="max-w-full border-none w-full h-[250px]"
      />
    </div>
  );
};

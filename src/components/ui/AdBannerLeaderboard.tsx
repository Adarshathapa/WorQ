import React from 'react';

export const AdBannerLeaderboard: React.FC = () => {
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
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            height: 90px;
            width: 728px;
          }
        </style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : '90a743e6f439503a7bcddb962f6654c1',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script src="https://www.highperformanceformat.com/90a743e6f439503a7bcddb962f6654c1/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent border-none">
      <iframe
        title="Advertisement"
        width="728"
        height="90"
        frameBorder={0}
        scrolling="no"
        srcDoc={adHtml}
        className="max-w-full border-none w-[728px] h-[90px]"
      />
    </div>
  );
};

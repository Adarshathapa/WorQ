import React from 'react';

export const AdBanner: React.FC = () => {
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
            height: 250px;
            width: 300px;
          }
        </style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : 'e729dc0cde9a11af364e70852e5ee526',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script src="https://www.highperformanceformat.com/e729dc0cde9a11af364e70852e5ee526/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <iframe
      title="Advertisement"
      width="300"
      height="250"
      frameBorder={0}
      scrolling="no"
      srcDoc={adHtml}
      className="w-[300px] h-[250px] border-none block mx-auto"
    />
  );
};

import React from 'react';
import { MockApiTool } from './MockApiTool';

export const PdfTextTool: React.FC = () => {
  return (
    <MockApiTool
      title="Convert PDF to Text"
      accept=".pdf"
      outputExtension=".txt"
      toolName="PDF to Text"
    />
  );
};

import React from 'react';
import { MockApiTool } from './MockApiTool';

export const OdtPdfTool: React.FC = () => {
  return (
    <MockApiTool
      title="Convert ODT to PDF"
      accept=".odt"
      outputExtension=".pdf"
      toolName="ODT to PDF"
    />
  );
};

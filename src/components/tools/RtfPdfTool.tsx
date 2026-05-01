import React from 'react';
import { MockApiTool } from './MockApiTool';

export const RtfPdfTool: React.FC = () => {
  return (
    <MockApiTool
      title="Convert RTF to PDF"
      accept=".rtf"
      outputExtension=".pdf"
      toolName="RTF to PDF"
    />
  );
};

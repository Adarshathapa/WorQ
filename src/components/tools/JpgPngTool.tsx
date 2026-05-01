import React from 'react';
import { MockApiTool } from './MockApiTool';

export const JpgPngTool: React.FC = () => {
  return (
    <MockApiTool
      title="Convert JPG to PNG"
      accept=".jpg,.jpeg"
      outputExtension=".png"
      toolName="JPG to PNG Converter"
    />
  );
};

import { ToolItem } from './types';

export const TOOLS: ToolItem[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple documents into one',
    category: 'pdf',
    iconName: 'Combine',
    badges: ['Fast', 'Secure'],
    status: 'active'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size without quality loss',
    category: 'pdf',
    iconName: 'Minimize2',
    badges: ['AI', 'Smart'],
    status: 'active'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages from your document',
    category: 'pdf',
    iconName: 'Split',
    badges: ['Secure'],
    status: 'active'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Fix incorrectly scanned documents easily',
    category: 'pdf',
    iconName: 'RotateCw',
    status: 'active'
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    description: 'Erase image backgrounds instantly with AI',
    category: 'ai_tools',
    iconName: 'Eraser',
    badges: ['AI'],
    status: 'active'
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    description: 'Shrink your photos for faster sharing',
    category: 'image',
    iconName: 'Minimize2',
    badges: ['Lossless'],
    status: 'active'
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    description: 'Change image dimensions securely',
    category: 'image',
    iconName: 'Expand',
    status: 'active'
  },
  {
    id: 'crop-rotate-image',
    name: 'Crop & Rotate',
    description: 'Trim edges and flip image files perfectly',
    category: 'image',
    iconName: 'Crop',
    status: 'active'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    description: 'Add a custom text stamp for branding',
    category: 'pdf',
    iconName: 'ShieldCheck',
    status: 'active'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF files into editable DOCX',
    category: 'conversion',
    iconName: 'ArrowRightLeft',
    badges: ['Accurate'],
    status: 'active'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Transform Word documents into secure PDFs',
    category: 'conversion',
    iconName: 'ArrowRightLeft',
    status: 'active'
  },
  {
    id: 'ocr-pdf',
    name: 'OCR Scanner',
    description: 'Turn scanned images into editable text',
    category: 'ai_tools',
    iconName: 'ScanSearch',
    badges: ['AI', 'Smart'],
    status: 'active'
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    description: 'Convert plain text notes into clean PDFs',
    category: 'conversion',
    iconName: 'FileType',
    status: 'active'
  },
  {
    id: 'scan-to-pdf',
    name: 'Document Scanner',
    description: 'Digitize physical documents into PDFs',
    category: 'scan_files',
    iconName: 'ScanLine',
    status: 'active'
  },
  {
    id: 'signature-gen',
    name: 'Signature Maker',
    description: 'Create a digital signature for documents',
    category: 'image',
    iconName: 'PenLine',
    status: 'active'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF securely.',
    category: 'conversion',
    iconName: 'ArrowRightLeft',
    status: 'active'
  },
  {
    id: 'pdf-converter',
    name: 'File Converter',
    description: 'Transform any file securely and fast',
    category: 'conversion',
    iconName: 'ArrowRightLeft',
    badges: ['Fast'],
    status: 'active'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Transform spreadsheets into clean PDFs',
    category: 'conversion',
    iconName: 'ArrowRightLeft',
    status: 'soon'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    description: 'Convert slides into secure PDF files',
    category: 'conversion',
    iconName: 'ArrowRightLeft',
    status: 'soon'
  },
  {
    id: 'ai-writer',
    name: 'AI Editor',
    description: 'Generate high-quality drafts with AI',
    category: 'ai_tools',
    iconName: 'SlidersHorizontal',
    badges: ['AI'],
    status: 'soon'
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'Create any image using AI text to image',
    category: 'ai_tools',
    iconName: 'Image',
    badges: ['AI', 'New'],
    status: 'soon'
  },
  {
    id: 'ai-chat',
    name: 'AI Assistant',
    description: 'Smart chat assistant to help you work',
    category: 'ai_tools',
    iconName: 'MessageSquareText',
    badges: ['AI'],
    status: 'soon'
  },
  {
    id: 'qr-scanner',
    name: 'QR Scanner',
    description: 'Scan and decode QR codes instantly',
    category: 'scan_files',
    iconName: 'QrCode',
    status: 'soon'
  },
  {
    id: 'my-files',
    name: 'File Vault',
    description: 'Browse your processed file history',
    category: 'scan_files',
    iconName: 'FolderClosed',
    badges: ['Local'],
    status: 'active'
  }
];

export const POPULAR_TOOLS = ['merge-pdf', 'compress-pdf', 'remove-background', 'compress-image'];

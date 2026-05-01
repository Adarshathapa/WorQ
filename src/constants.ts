import { ToolItem } from './types';

export const TOOLS: ToolItem[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Securely combine multiple PDF files into a single document in seconds. Perfect for organizing reports, study materials, and office paperwork without losing page quality.',
    category: 'pdf',
    iconName: 'merge-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce your PDF file size while maintaining high visual quality. Ideal for email attachments and website uploads where large files are often restricted.',
    category: 'pdf',
    iconName: 'compress-pdf',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract specific pages or break a large PDF into multiple smaller documents. Great for separating sections of ebooks or sending specific excerpts to colleagues.',
    category: 'pdf',
    iconName: 'split-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Fix incorrectly scanned documents by rotating individual pages or the entire file. Simply click to align your pages in portrait or landscape orientation perfectly.',
    category: 'pdf',
    iconName: 'rotate-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'remove-background',
    name: 'Background Remover',
    description: 'Remove backgrounds from your images instantly using AI. Create professional product photos or transparent PNGs for your design projects with zero effort.',
    category: 'image',
    iconName: 'magic',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    description: 'Shrink JPEG, PNG, and WebP images without noticeable quality loss. Speed up your website performance and save storage space on your device instantly.',
    category: 'image',
    iconName: 'compress-image',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    description: 'Change image dimensions by pixels or percentage. Scale your photos for social media profiles, thumbnails, or specific print requirements with high precision.',
    category: 'image',
    iconName: 'resize-image',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'crop-rotate-image',
    name: 'Crop & Rotate',
    description: 'Trim unwanted edges and flip image files to find the perfect composition. A straightforward tool for quick photo edits before sharing or publishing.',
    category: 'image',
    iconName: 'crop',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark',
    description: 'Protect your PDF documents by adding a custom text watermark. Discourage unauthorized copying and maintain your brand identity on every page.',
    category: 'pdf',
    iconName: 'watermark-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert static PDF files into editable Word documents. Seamlessly extract text and layouts to make changes to your existing documents without retyping.',
    category: 'conversion',
    iconName: 'pdf-doc',
    color: '#FFA4B6',
    status: 'active'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Transform Word documents and text files into standard PDF format. Ensure your files look the same on every device and are protected from unauthorized edits.',
    category: 'conversion',
    iconName: 'doc-pdf',
    color: '#FFA4B6',
    status: 'active'
  },
  {
    id: 'ocr-pdf',
    name: 'OCR Scanner',
    description: 'Turn scanned documents and images into editable text using OCR. Save hours of manual typing by extracting information from non-searchable files instantly.',
    category: 'conversion',
    iconName: 'text-ocr',
    color: '#FFA4B6',
    status: 'active'
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    description: 'Convert your plain text notes, snippets, or code into clean, secure PDF files. Add a professional touch to your text-based data for easy sharing and printing.',
    category: 'conversion',
    iconName: 'text-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'scan-to-pdf',
    name: 'Document Scanner',
    description: 'Scan physical documents using your mobile camera and save them as high-quality PDFs. Your digital office in your pocket for receipts, notes, and contracts.',
    category: 'scan_files',
    iconName: 'camera',
    color: '#FF2D55',
    status: 'active'
  },
  {
    id: 'signature-gen',
    name: 'Signature Maker',
    description: 'Create your digital signature by drawing or typing. Download as PNG and resize it for exams and online forms instantly.',
    category: 'image',
    iconName: 'signature-gen',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'pdf-converter',
    name: 'Any Converter',
    description: 'Convert any file to multiple formats like Doc to PDF, PDF to Doc, Word to PDF, image formats and more in one place.',
    category: 'conversion',
    iconName: 'pdf-converter',
    color: '#FF2D55',
    status: 'active'
  },
  {
    id: 'odt-to-pdf',
    name: 'ODT to PDF',
    description: 'Convert ODT (OpenDocument Text) files to PDF documents easily. Maintain formatting and layout exactly as they appear in the original file.',
    category: 'conversion',
    iconName: 'doc-pdf',
    color: '#4B5563',
    status: 'active'
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert JPG images to PNG format instantly. Ideal for getting images ready for transparent background removal or keeping pristine quality.',
    category: 'image',
    iconName: 'image',
    color: '#a855f7',
    status: 'active'
  },
  {
    id: 'rtf-to-pdf',
    name: 'RTF to PDF',
    description: 'Convert Rich Text Format (RTF) documents to PDF files quickly and securely without installing any software.',
    category: 'conversion',
    iconName: 'doc-pdf',
    color: '#3B82F6',
    status: 'active'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract pure text from PDF documents for easy editing and copying. No more retyping long documents.',
    category: 'conversion',
    iconName: 'pdf-text',
    color: '#10B981',
    status: 'active'
  },
  {
    id: 'my-files',
    name: 'File Manager',
    description: 'Browse your recent processed file tools history securely',
    category: 'scan_files',
    iconName: 'folder',
    color: '#50B2C0',
    status: 'active'
  }
];

export const POPULAR_TOOLS = ['merge-pdf', 'compress-pdf', 'remove-background', 'compress-image'];

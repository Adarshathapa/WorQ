export const convertFileToBlob = async (file: File, outputFormat: string): Promise<{ blob: Blob, mimeType: string }> => {
  const ext = outputFormat.toLowerCase();
  const isInputImage = file.type.startsWith('image/');
  
  if (isInputImage) {
    // Process Image
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      return await new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0);
          canvas.toBlob((b) => {
            URL.revokeObjectURL(url);
            if (b) resolve({ blob: b, mimeType: ext === 'png' ? 'image/png' : 'image/jpeg' });
            else reject(new Error('Canvas toBlob failed'));
          }, ext === 'png' ? 'image/png' : 'image/jpeg', 0.95);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });
    } else if (ext === 'pdf') {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      const arrayBuffer = await file.arrayBuffer();
      let pdfImage;
      if (file.type === 'image/png') {
        pdfImage = await pdfDoc.embedPng(arrayBuffer);
      } else {
        pdfImage = await pdfDoc.embedJpg(arrayBuffer);
      }
      const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: pdfImage.width,
        height: pdfImage.height,
      });
      const pdfBytes = await pdfDoc.save();
      return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), mimeType: 'application/pdf' };
    }
  }

  // Text-based Conversion (Input might be text, pdf, etc, we'll extract naive text)
  let contentText = "";
  if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
    contentText = await file.text();
  } else {
    // If we can't extract, we'll try to just render a small generic string containing file info.
    contentText = `[File Info]\nName: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type}\n\n[Content hidden or binary]`;
    if (!isInputImage && file.size < 500000) {
      try {
        const text = await file.text();
        // Check if mostly printable
        if (/^[\x00-\x7F]*$/.test(text.substring(0, 500))) {
          contentText = text;
        }
      } catch (e) {
        // ignore
      }
    }
  }

  // Create Output
  if (ext === 'pdf') {
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Simple text wrapping / multiline drawing
    const lines = contentText.substring(0, 3000).split('\n'); // limit to avoid memory issues
    let yIdx = page.getSize().height - 50;
    for (const line of lines) {
       if (yIdx < 50) break;
       page.drawText(line.substring(0, 100), { x: 50, y: yIdx, size: 12, font, color: rgb(0, 0, 0) });
       yIdx -= 16;
    }
    
    const pdfBytes = await pdfDoc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), mimeType: 'application/pdf' };
  } else if (ext === 'docx' || ext === 'doc') {
    const { Document, Packer, Paragraph, TextRun } = await import('docx');
    const doc = new Document({
      sections: [{
        properties: {},
        children: contentText.substring(0, 5000).split('\n').map(line => new Paragraph({ children: [new TextRun(line)] })),
      }],
    });
    const blob = await Packer.toBlob(doc);
    return { blob, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  } else if (ext === 'rtf') {
    const rtfContent = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}} {\\*\\generator Riched20 10.0.19041}\\viewkind4\\uc1 \\pard\\sa200\\sl276\\slmult1\\f0\\fs22\\lang9 ${contentText.substring(0,5000).replace(/\n/g, '\\par ')} \\par}`;
    return { blob: new Blob([rtfContent], { type: 'application/rtf' }), mimeType: 'application/rtf' };
  } else if (ext === 'txt') {
    return { blob: new Blob([contentText], { type: 'text/plain' }), mimeType: 'text/plain' };
  } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
    return await new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = 800; canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas ctx not found'));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      const lines = contentText.substring(0, 1500).split('\n');
      lines.forEach((l, i) => {
        if (50 + i * 20 < 580) ctx.fillText(l.substring(0, 80), 50, 50 + i * 20);
      });
      canvas.toBlob(b => {
        if (b) resolve({ blob: b, mimeType: ext === 'png' ? 'image/png' : 'image/jpeg' });
        else reject(new Error('Canvas toBlob failed'));
      }, ext === 'png' ? 'image/png' : 'image/jpeg');
    });
  }
  
  return { blob: new Blob([contentText], { type: 'application/octet-stream' }), mimeType: 'application/octet-stream' };
};

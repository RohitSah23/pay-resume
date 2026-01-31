import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import mammoth from 'mammoth';
// @ts-ignore
import PDFParser from 'pdf2json';

async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true); // true = need raw text

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      // @ts-ignore
      const text = pdfParser.getRawTextContent();
      // pdf2json raw text might need some cleanup (it often has page markers etc)
      // but for ATS keyword matching, more text is usually better than less.
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = '';

    const fileName = file.name.toLowerCase();

    if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        extractedText = await parsePDF(buffer);
      } catch (pdfError) {
        console.error('PDF Parse Error:', pdfError);
        return NextResponse.json({ error: 'Failed to parse PDF resume.' }, { status: 500 });
      }
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx')
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } catch (docxError) {
        console.error('DOCX Parse Error:', docxError);
        return NextResponse.json({ error: 'Failed to parse DOCX resume.' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or DOCX.' }, { status: 400 });
    }

    // Basic sanitization of the extracted text
    const cleanText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .trim();

    if (!cleanText || cleanText.length < 10) {
      return NextResponse.json({ error: 'Resume seems empty or could not be read properly.' }, { status: 400 });
    }

    return NextResponse.json({ text: cleanText, fileName: file.name });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

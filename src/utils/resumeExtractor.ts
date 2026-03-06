/**
 * Resume Extraction Utilities
 * Handles PDF parsing and text extraction from resume files
 */

/**
 * Extract text from PDF file using pdf.js library
 * Requires: npm install pdfjs-dist
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log('Starting PDF extraction for:', file.name);

    // Import pdf.js library
    const pdfjsModule = await import('pdfjs-dist');
    const pdfjsLib = pdfjsModule.default || pdfjsModule;

    // Set up worker with explicit version
    const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    console.log('PDF.js worker configured:', workerSrc);

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to ArrayBuffer, size:', arrayBuffer.byteLength);

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages);

    let extractedText = '';
    let pageCount = 0;

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        if (!textContent || !textContent.items || textContent.items.length === 0) {
          console.warn(`Page ${pageNum} has no text items`);
          continue;
        }

        // Extract strings from items
        const pageText = textContent.items
          .map((item: any) => {
            // Handle different item types
            if (typeof item.str === 'string') {
              return item.str.trim();
            }
            return '';
          })
          .filter((str: string) => str.length > 0)
          .join(' ');

        if (pageText.length > 0) {
          extractedText += pageText + '\n';
          pageCount++;
          console.log(`Page ${pageNum} extracted: ${pageText.length} characters`);
        }
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${pageNum}:`, pageError);
        // Continue to next page
      }
    }

    console.log(
      `PDF extraction complete: ${pageCount}/${pdf.numPages} pages, ${extractedText.length} total characters`
    );

    if (!extractedText || extractedText.trim().length < 20) {
      throw new Error(`Could not extract text from PDF. Got only ${extractedText.length} characters.`);
    }

    return extractedText;
  } catch (error) {
    console.error('PDF extraction failed:', error);

    // Provide detailed error message
    const errorMsg = (error as Error).message || 'Unknown error';
    throw new Error(
      `PDF extraction failed: ${errorMsg}. ` +
        `This PDF may be scanned/image-based or corrupted. ` +
        `Solutions: 1) Convert PDF to TXT using an online tool, 2) Use a different PDF file, 3) Upload as plain text instead.`
    );
  }
};

/**
 * Extract text from plain text file
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      resolve(text || '');
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Extract text from uploaded resume file (handles PDF and TXT)
 */
export const extractResumeText = async (file: File): Promise<string> => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  try {
    // Handle PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('PDF detected, attempting extraction...');

      try {
        // Try PDF extraction first
        const extractedText = await extractTextFromPDF(file);
        console.log('PDF extraction succeeded');
        return extractedText;
      } catch (pdfError) {
        console.warn('PDF.js extraction failed:', pdfError);

        // Fallback: Try to read raw file and extract any readable text
        try {
          console.log('Trying aggressive fallback extraction...');
          const rawContent = await extractTextFromFile(file);

          // Try to extract readable content from raw PDF
          const readableText = extractReadableTextFromRawPDF(rawContent);

          if (readableText && readableText.trim().length > 50) {
            console.log('Fallback extraction succeeded, got readable text');
            return readableText;
          }
        } catch (fallbackError) {
          console.warn('Fallback text extraction also failed:', fallbackError);
        }

        // If both methods fail, provide specific guidance
        const errorMsg =
          `Cannot extract readable text from "${fileName}". ` +
          `This PDF may be: (1) Scanned/image-based, (2) Password-protected, or (3) Corrupted. ` +
          `⭐ Best solution: Convert your PDF to plain TEXT format using an online tool like ` +
          `https://online2pdf.com/convert-pdf-to-text or https://www.ilovepdf.com/pdf_to_word`;

        throw new Error(errorMsg);
      }
    }

    // Handle text files
    if (
      fileType === 'text/plain' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.txt') ||
      fileName.endsWith('.docx')
    ) {
      console.log('Text file detected, extracting...');
      return await extractTextFromFile(file);
    }

    // Default to text extraction for unknown types
    console.log('Unknown file type, attempting text extraction...');
    return await extractTextFromFile(file);
  } catch (error) {
    console.error('Error extracting resume text:', error);
    throw error;
  }
};

/**
 * Extract readable text from raw PDF content
 * Works as an aggressive fallback for PDFs that pdf.js can't handle
 */
export const extractReadableTextFromRawPDF = (rawContent: string): string => {
  if (!rawContent) return '';

  // Remove PDF headers and stream markers
  let cleaned = rawContent
    // Remove PDF binary markers and objects
    .replace(/%PDF[^%]*%EOF/gs, '') // Remove PDF wrapper
    .replace(/stream[\s\S]*?endstream/gs, '') // Remove binary streams
    .replace(/<<[\s\S]*?>>/gs, '') // Remove PDF dictionaries
    .replace(/obj\s[\s\S]*?endobj/gs, '') // Remove PDF objects
    // Remove control characters and non-printable chars
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, ' ')
    // Remove multiple spaces/newlines
    .replace(/\s+/g, ' ')
    // Remove common PDF noise patterns
    .replace(/[()[\]{}]/g, ' ')
    .replace(/\d{10,}/g, '') // Remove long number sequences
    .trim();

  // If we got at least some readable content
  if (cleaned.length > 100) {
    // Extract words and reconstruct meaningful content
    const words = cleaned
      .split(/\s+/)
      .filter((word) => {
        // Keep words that are:
        // - 2+ characters
        // - contain at least one letter
        // - not all numbers
        return word.length >= 2 && /[a-z]/i.test(word) && !/^\d+$/.test(word);
      })
      .slice(0, 2000) // Limit to first 2000 words
      .join(' ');

    return words;
  }

  return '';
};

/**
 * Validate resume file
 */
export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
  const maxFileSize = 10 * 1024 * 1024; // 10 MB
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExtensions = ['.pdf', '.txt', '.docx'];

  // Check file size
  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds 10 MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
    };
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const isValidType = allowedTypes.includes(file.type) || allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!isValidType) {
    return {
      valid: false,
      error: `Invalid file type. Supported formats: PDF, TXT, DOCX`,
    };
  }

  return { valid: true };
};

/**
 * Validate that text is actually extracted resume content, not raw PDF binary
 */
export const isValidResumeText = (text: string): boolean => {
  if (!text || text.length < 20) {
    return false;
  }

  // Check for PDF binary markers (signs of raw PDF stream)
  const pdfBinaryMarkers = [
    '%PDF-', // PDF header
    'stream', // PDF stream indicator
    'endobj', // PDF object end
    'xref', // PDF cross-reference
    'startxref', // PDF start of xref
    'obj <<', // PDF object dictionary
    'endstream', // PDF stream end
  ];

  const lowerText = text.substring(0, 1000).toLowerCase();
  const hasPdfMarkers = pdfBinaryMarkers.some((marker) => lowerText.includes(marker.toLowerCase()));

  if (hasPdfMarkers) {
    console.warn('Detected raw PDF binary data - text extraction failed!');
    return false;
  }

  // Check for minimum readable text (at least some words)
  const words = text.match(/\b[a-z]{3,}\b/gi) || [];
  if (words.length < 5) {
    console.warn('Not enough readable words found in text');
    return false;
  }

  return true;
};

/**
 * Clean and normalize resume text
 */
export const cleanResumeText = (text: string): string => {
  if (!text) return '';

  // Check if text is likely valid (log warning if suspicious)
  if (!isValidResumeText(text)) {
    console.warn('Warning: Text may contain PDF markers or be poorly extracted. Proceeding anyway...');
    // Don't throw - let it continue with cleanup
  }

  return (
    text
      // Remove extra whitespace and line breaks
      .replace(/(\r\n|\n|\r)/gm, ' ')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Remove special characters except common ones
      .replace(/[^\w\s\-.,@():/]/g, '')
      // Trim whitespace
      .trim()
  );
};

/**
 * Estimate token count (rough approximation)
 * Groq uses similar tokenization to OpenAI: ~1 token per 4 characters
 */
export const estimateTokens = (text: string): number => {
  // Remove extra whitespace for more accurate count
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  // OpenAI/Groq approximation: 1 token ≈ 4 characters
  return Math.ceil(cleanedText.length / 4);
};

/**
 * Truncate resume text to stay under token limit
 * Leaves room for prompt and response
 */
export const truncateResumeText = (text: string, maxTokens: number = 8000): string => {
  const estimatedTokens = estimateTokens(text);

  if (estimatedTokens <= maxTokens) {
    return text;
  }

  // Calculate safe character limit (leave 20% margin for safety)
  const safeCharLimit = Math.floor(maxTokens * 4 * 0.8);
  return text.slice(0, safeCharLimit);
};

/**
 * Parse resume file and return cleaned text
 */
export const parseResumeFile = async (file: File): Promise<string> => {
  // Validate file
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Extract text
  const rawText = await extractResumeText(file);

  // Clean and normalize
  const cleanedText = cleanResumeText(rawText);

  if (!cleanedText || cleanedText.length < 50) {
    throw new Error('Resume file appears to be empty or contains insufficient text');
  }

  // Truncate to avoid token limit issues
  const truncatedText = truncateResumeText(cleanedText);

  return truncatedText;
};

/**
 * Batch process multiple resume files
 */
export const processBatchResumes = async (
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<{ file: File; text: string; error?: string }[]> => {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const text = await parseResumeFile(files[i]);
      results.push({ file: files[i], text });
    } catch (error) {
      results.push({
        file: files[i],
        text: '',
        error: (error as Error).message,
      });
    }

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return results;
};

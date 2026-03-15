# Document Conversion Implementation

## Overview
Implemented a backend-first document conversion flow that converts documents (PDF, DOCX, etc.) to text on the server, then analyzes the extracted text using AI.

## Architecture

```
Document Upload
    ↓
[Frontend] ResumeImportPage
    ↓
[Hook] useDocumentConversion
    ↓
[API] api.documents.convertToText()
    ↓
[Backend] POST /api/v1/documents/convert-to-text
    ↓
Convert to Text (Python FastAPI)
    ↓
Return Extracted Text
    ↓
[Frontend] Process Text with AI (Groq)
    ↓
Extract Resume Data
    ↓
Display & Import
```

## Files Modified/Created

### 1. API Endpoints (`src/lib/api-endpoints.ts`)
Added new document endpoints:
```typescript
documents: {
  convertToText: '/api/v1/documents/convert-to-text',
  supportedFormats: '/api/v1/documents/supported-formats',
}
```

### 2. API Service (`src/lib/api.ts`)
- Added `DocumentConversionResponse` type import
- Added document service in mock mode (returns empty response)
- Added document service in real API mode:
  - `convertToText(file: File)` - sends file to backend
  - `getSupportedFormats()` - gets supported file types
- Updated `ApiInterface` to include documents service

### 3. Types (`src/features/resumeBuilder/types.ts`) - NEW
```typescript
interface DocumentConversionResponse {
  success: boolean;
  filename: string;
  text: string;
  char_count: number;
  message: string;
  error?: string;
}
```

### 4. Custom Hook (`src/features/resumeBuilder/hooks/useDocumentConversion.ts`) - NEW
React hook that manages document conversion state and provides:
- `convertDocument(file: File)` - async function to convert
- `isLoading` - loading state
- `error` - error message
- `success` - success flag
- `data` - conversion response
- `reset()` - reset state

### 5. ResumeImportPage Component (`src/features/resumeBuilder/ResumeImportPage.tsx`)
Updated to use backend conversion:
1. **Step 1**: Convert document using backend API
2. **Step 2**: Process extracted text with AI (Groq)
3. Handles errors at both stages
4. Tracks total processing time

## Flow

1. User uploads document (PDF, DOCX, etc.)
2. File validation on frontend
3. Create "processing" state entry
4. **Send to Backend**: `POST /api/v1/documents/convert-to-text`
   - Backend extracts text from document
   - Returns: `{ success, text, char_count, filename, message }`
5. **If conversion succeeds**:
   - Create temporary text file with extracted content
   - Send to AI (Groq) for analysis
   - Extract resume data (name, experience, education, skills, etc.)
6. **Display results**:
   - Show extracted data in preview
   - Allow import to resume builder

## Error Handling

Two-layer error handling:
- **Document Conversion Errors** (Backend): File format, corruption, size limits
- **AI Analysis Errors** (Frontend/Groq): Text analysis, parsing failures

Each error is caught and displayed to user with appropriate message.

## Backend Requirements

Your FastAPI backend needs this endpoint:

```python
@router.post('/documents/convert-to-text')
async def convert_document_to_text(file: UploadFile = File(...)):
    """
    Convert document to text
    
    Supported formats: PDF, DOCX, DOC, XLSX, PPTX, TXT, RTF
    Max size: 10MB (configurable)
    
    Returns:
    {
        "success": true,
        "filename": "resume.pdf",
        "text": "extracted text...",
        "char_count": 5000,
        "message": "Document converted successfully"
    }
    """
```

## Libraries Needed (Backend - Python)
- `python-pptx` - for PowerPoint
- `python-docx` - for Word documents
- `PyPDF2` or `pdfplumber` - for PDFs
- `openpyxl` - for Excel
- `python-magic` or `filetype` - for file validation

## Benefits of Backend Conversion

✅ **Better file support** - Python libraries handle complex formats  
✅ **No size limits** - Large files won't crash browser  
✅ **More reliable** - Centralized processing, error handling  
✅ **Security** - Files processed server-side only  
✅ **Scalable** - Can add OCR, advanced parsing later  
✅ **Consistency** - Same conversion logic for all clients  

## Usage

The component automatically handles the entire flow:
1. User selects document
2. Shows loading spinner
3. Converts to text on backend
4. Analyzes with AI
5. Shows preview and allows import

No additional code needed in the component - the hook handles everything!

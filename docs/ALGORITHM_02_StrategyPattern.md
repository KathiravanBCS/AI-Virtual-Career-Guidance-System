# Algorithm 2: Strategy Pattern - Resume Extraction

## Overview
**Type:** Strategy Design Pattern (GoF - Gang of Four)  
**Real-world Usage:** Polymorphic resource extraction based on file properties  
**Location in Code:** `src/utils/resumeAIIntegration.ts`, `src/utils/resumeExtractor.ts`  
**Time Complexity:** O(n) where n = file size  
**Space Complexity:** O(n) for storing extracted text  

---

## Problem Statement

A resume extraction system must handle multiple file formats and sizes:

```
Challenges:
├─ PDF files (scanned or text-based)
├─ Text files (.txt, .docx as text)
├─ Large files (>10KB tokens) → too expensive for AI
├─ Small files → worth AI analysis for accuracy
├─ Corrupted/image-based PDFs → need fallback
└─ Different extraction quality requirements
```

**Naive Approach (WRONG):**
```javascript
if (file.type === 'pdf' && size < 10000) {
    return aiExtract(file);
} else if (file.type === 'pdf') {
    return regexExtract(file);
} else if (file.type === 'text') {
    return fileReaderExtract(file);
}
// Problem: Additive if-else chain → unmaintainable & hard to test
```

---

## Solution: Strategy Pattern

### Architecture Diagram
```
┌──────────────────────────────────────────────────────┐
│         ResumeExtractionContext (Orchestrator)       │
├──────────────────────────────────────────────────────┤
│  selectStrategy(file, tokenEstimate)                 │
│  extract(file)                                       │
│  processResume(file, tokenEstimate)                  │
└──────────────────────────────────────────────────────┘
           │
           ├── delegates to ──┐
           │                  │
           ▼                  ▼
    
  ┌────────────────────┐  ┌────────────────────┐
  │ Strategy Interface │  │ Strategy Interface │
  │ ─────────────────  │  │ ─────────────────  │
  │ + canHandle()      │  │ + canHandle()      │
  │ + extract()        │  │ + extract()        │
  │ + getName()        │  │ + getName()        │
  └────────────────────┘  └────────────────────┘
           △                        △
           │                        │
           └────────┬──────────┬────┘
                    │          │
         ┌──────────▼──┐  ┌────▼──────────┐
         │ PDFjs       │  │ Regex         │
         │ Strategy    │  │ Strategy      │
         └─────────────┘  └───────────────┘
         │ AIExtraction    │ Fast, cheap
         │ Accurate, slow  │ Less accurate
         └─────────────────┘
```

---

## Strategy Implementations

### Strategy 1: AI Extraction
```
Name:     AIExtractionStrategy
Cost:     EXPENSIVE (API calls)
Speed:    SLOW (~2-5s per request)
Accuracy: VERY HIGH (90%+)
Best for: Small-medium PDFs (<10K tokens)

Preconditions (canHandle):
✓ File type = PDF or text
✓ Estimated tokens < 10,000
✓ API rate limit not exceeded

Process:
1. Extract raw text from PDF
2. Send to Groq LLM with structured prompt
3. Parse JSON response for:
   - Candidate name
   - Email, phone
   - Work experience
   - Education
   - Skills
   - Certifications
4. Return structured ExtractedResume
```

### Strategy 2: Regex Extraction (Fallback)
```
Name:     RegexExtractionStrategy
Cost:     CHEAP (no API calls)
Speed:    VERY FAST (<100ms)
Accuracy: MODERATE (60-70%)
Best for: Large files (>10K tokens)

Preconditions (canHandle):
✓ Always returns true (universal fallback)

Process:
1. Search for email pattern: \w+@[\w.]+
2. Search for phone: (xxx) xxx-xxxx
3. Search for years: \d+ years?
4. Search for "Skills:" sections
5. Extract first 5000 characters
6. Return semi-structured result
```

### Strategy 3: PDF.js Extraction
```
Name:     PDFJSExtractionStrategy
Cost:     FREE (libraries)
Speed:    FAST (~500ms per page)
Accuracy: HIGH (85%+)
Best for: Any PDF file

Preconditions (canHandle):
✓ File type = application/pdf
✓ OR file name ends in .pdf

Process:
1. Load PDF.js library dynamically
2. Convert file to ArrayBuffer
3. Load PDF document
4. For each page:
   a. Get text content
   b. Extract text items
   c. Concatenate with newlines
5. Return full text (to be processed further)
```

---

## Algorithm: Strategy Selection

```
function selectStrategy(file, tokenEstimate):
    // Try strategies in priority order
    for strategy in [PDFjs, AI, Regex]:
        if strategy.canHandle(file, tokenEstimate):
            selectedStrategy = strategy
            return strategy
    
    // Ultimate fallback
    selectedStrategy = Regex
    return Regex
    
    // Time complexity: O(k) where k = number of strategies
    // In practice: O(1) since k is fixed at 3
```

### Selection Logic Table

| File Type | Token Count | Selected Strategy |
|-----------|-------------|-------------------|
| PDF | < 10K | PDF.js then AI |
| PDF | > 10K | PDF.js then Regex |
| TXT | < 10K | AI |
| TXT | > 10K | Regex |
| Unknown | Any | Regex (fallback) |

---

## Real-world Execution Flow

### Example: Large PDF Resume
```
1. User uploads "resume.pdf" (25 MB)
   
2. Context calls selectStrategy():
   └─ Tries PDFjs.canHandle() → TRUE
   └─ selectedStrategy = PDFjs
   
3. Context calls extract():
   └─ PDFjs extracts text (3 seconds)
   └─ Returns ~50KB text
   
4. Token estimation: 50KB / 4 ≈ 12,500 tokens
   
5. Token check: 12,500 > 10,000 limit
   └─ Too expensive for AI!
   └─ Fall back to Regex strategy
   
6. Regex extracts:
   ├─ email: john.doe@gmail.com
   ├─ phone: (555) 123-4567
   ├─ years: 8
   ├─ skills: React, TypeScript, Node.js
   └─ Returns in ~100ms
   
7. Resume preview shown to user
   └─ Can edit/import to builder
```

---

## Why Strategy Pattern?

| Benefit | Why |
|---------|-----|
| **Open/Closed Principle** | Can add new strategies without modifying Context |
| **Single Responsibility** | Each strategy handles one extraction type |
| **Testability** | Mock strategies for unit tests easily |
| **Composability** | Ask during runtime which strategy to use |
| **Cost-aware** | Choose cheap strategy for large files automatically |
| **Maintainability** | Changing AI extraction doesn't affect Regex logic |

---

## Extension Points

### Add Custom OCR Strategy
```
class OCRExtractionStrategy implements ExtractionStrategy:
    canHandle(file):
        return file.name.includes('scanned')
    
    extract(file):
        // Use Tesseract.js for OCR
        // Return extracted text
        
    getName():
        return "OCR_EXTRACTION"

// Register in context
context.addStrategy(new OCRExtractionStrategy())
context.selectStrategy(file, tokens)
```

---

## Application in Career Guidance System

**Resume Builder:** Users upload PDF/DOC  
**Smart Selection:** System picks extraction method based on file size  
**API Costs:** Large files use regex (free), small ones get AI accuracy  
**User Experience:** Instant results even for 50MB scanned PDFs  
**Fallback Chain:** Never leaves user without extracted data

---

## Design Pattern Classification
✅ **Strategy Pattern (GoF)**  
✅ **Structural Pattern**  
✅ **Behavioral Pattern**  

---

*Perfect for: Pluggable algorithms, cost optimization, format handling*

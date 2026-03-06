/**
 * Resume AI Integration
 * Combines PDF extraction with AI analysis for complete resume processing
 */

import { analyzeResumeWithAI, ExtractedResume, extractResumeInformation } from '../config/groq.config';
import { estimateTokens, parseResumeFile } from './resumeExtractor';

export interface ResumeProcessingResult {
  success: boolean;
  fileName: string;
  extractedData?: ExtractedResume;
  error?: string;
  processingTime: number;
  tokenCount?: number;
}

/**
 * Complete resume processing pipeline
 * 1. Extract text from PDF/file
 * 2. Estimate tokens to avoid API limits
 * 3. Send to AI for analysis
 * 4. Return structured resume data
 */
export const processResumeFile = async (file: File, useAI: boolean = true): Promise<ResumeProcessingResult> => {
  const startTime = Date.now();

  try {
    // Step 1: Extract and clean text
    console.log(`Extracting text from ${file.name}...`);
    const resumeText = await parseResumeFile(file);

    // Step 2: Check token count
    const tokenCount = estimateTokens(resumeText);
    console.log(`Resume text: ~${tokenCount} tokens`);

    // Step 3: Analyze with AI
    let extractedData: ExtractedResume;

    if (useAI) {
      if (tokenCount > 10000) {
        console.warn(`Resume is large (${tokenCount} tokens). Using simple extraction instead to avoid API limits.`);
        // Fall back to simple extraction for large files
        const simpleData = extractResumeInformation(resumeText);
        extractedData = {
          candidateName: simpleData.candidateName || 'Unknown',
          email: simpleData.email || '',
          phone: simpleData.phone,
          location: simpleData.location,
          totalYearsExperience: simpleData.totalYearsExperience || 0,
          topSkills: simpleData.topSkills || [],
          workExperience: simpleData.workExperience || [],
          education: simpleData.education || [],
          certifications: simpleData.certifications,
          summary: simpleData.summary,
          linkedIn: simpleData.linkedIn,
          portfolio: simpleData.portfolio,
        };
      } else {
        console.log('Analyzing resume with AI...');
        extractedData = await analyzeResumeWithAI(resumeText);
      }
    } else {
      // Use simple extraction
      console.log('Using simple extraction...');
      const simpleData = extractResumeInformation(resumeText);
      extractedData = {
        candidateName: simpleData.candidateName || 'Unknown',
        email: simpleData.email || '',
        phone: simpleData.phone,
        location: simpleData.location,
        totalYearsExperience: simpleData.totalYearsExperience || 0,
        topSkills: simpleData.topSkills || [],
        workExperience: simpleData.workExperience || [],
        education: simpleData.education || [],
        certifications: simpleData.certifications,
        summary: simpleData.summary,
        linkedIn: simpleData.linkedIn,
        portfolio: simpleData.portfolio,
      };
    }

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      fileName: file.name,
      extractedData,
      processingTime,
      tokenCount,
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Resume processing error:', error);

    return {
      success: false,
      fileName: file.name,
      error: (error as Error).message,
      processingTime,
    };
  }
};

/**
 * Process multiple resumes with progress tracking
 */
export const processBatchResumes = async (
  files: File[],
  useAI: boolean = true,
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<ResumeProcessingResult[]> => {
  const results: ResumeProcessingResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress(i + 1, files.length, file.name);
    }

    const result = await processResumeFile(file, useAI);
    results.push(result);
  }

  return results;
};

/**
 * Generate resume summary/suggestions based on extracted data
 */
export const generateResumeSuggestions = async (resume: ExtractedResume): Promise<string> => {
  const prompt = `Based on the following extracted resume information, provide 3-5 actionable suggestions to improve the resume:

Candidate Name: ${resume.candidateName}
Email: ${resume.email}
Total Years of Experience: ${resume.totalYearsExperience}
Top Skills: ${resume.topSkills.join(', ')}
Summary: ${resume.summary || 'Not provided'}

Work Experience:
${resume.workExperience.map((w) => `- ${w.jobTitle} at ${w.company} (${w.duration})`).join('\n')}

Education:
${resume.education.map((e) => `- ${e.degree} in ${e.field} from ${e.institution}`).join('\n')}

Please provide:
1. Strengths of this resume
2. Areas for improvement
3. Specific recommendations for skill enhancement
4. Tips for better keyword optimization
5. Suggestions for better formatting or presentation`;

  try {
    const { generateChatResponse } = await import('../config/groq.config');
    const response = await generateChatResponse(prompt, {});
    return response;
  } catch (error) {
    console.error('Error generating resume suggestions:', error);
    throw new Error('Failed to generate resume suggestions');
  }
};

/**
 * Compare two resumes
 */
export const compareResumes = async (resume1: ExtractedResume, resume2: ExtractedResume): Promise<string> => {
  const prompt = `Compare the following two resumes and provide insights:

RESUME 1:
Name: ${resume1.candidateName}
Experience: ${resume1.totalYearsExperience} years
Skills: ${resume1.topSkills.join(', ')}
Education: ${resume1.education.map((e) => e.degree).join(', ')}

RESUME 2:
Name: ${resume2.candidateName}
Experience: ${resume2.totalYearsExperience} years
Skills: ${resume2.topSkills.join(', ')}
Education: ${resume2.education.map((e) => e.degree).join(', ')}

Please provide:
1. Comparative strengths and weaknesses
2. Skill set differences
3. Experience level comparison
4. Which resume is more suitable for technical roles
5. Recommendations for improvement for each`;

  try {
    const { generateChatResponse } = await import('../config/groq.config');
    const response = await generateChatResponse(prompt, {});
    return response;
  } catch (error) {
    console.error('Error comparing resumes:', error);
    throw new Error('Failed to compare resumes');
  }
};

/**
 * Generate personalized career path based on resume
 */
export const generateCareerPathFromResume = async (resume: ExtractedResume): Promise<string> => {
  const prompt = `Based on this resume information, suggest a personalized career development path:

Candidate: ${resume.candidateName}
Current Experience: ${resume.totalYearsExperience} years
Current Skills: ${resume.topSkills.join(', ')}
Background: ${resume.education.map((e) => `${e.degree} in ${e.field}`).join(', ')}

Latest Role: ${resume.workExperience[0]?.jobTitle || 'Not specified'} at ${resume.workExperience[0]?.company || 'Not specified'}

Please provide:
1. Recommended next career moves
2. Skills to acquire in the next 6-12 months
3. Potential career paths to pursue
4. Industry opportunities based on current profile
5. Certifications or training recommendations`;

  try {
    const { generateChatResponse } = await import('../config/groq.config');
    const response = await generateChatResponse(prompt, {});
    return response;
  } catch (error) {
    console.error('Error generating career path:', error);
    throw new Error('Failed to generate career path');
  }
};

/**
 * Format extracted resume data for display
 */
export const formatResumeForDisplay = (resume: ExtractedResume): Record<string, any> => {
  return {
    'Personal Information': {
      Name: resume.candidateName,
      Email: resume.email,
      Phone: resume.phone || 'Not provided',
      Location: resume.location || 'Not provided',
    },
    'Professional Summary': resume.summary || 'Not provided',
    Experience: `${resume.totalYearsExperience} years`,
    'Top Skills': resume.topSkills,
    'Work Experience': resume.workExperience.map((exp, idx) => ({
      [`${idx + 1}. ${exp.jobTitle}`]: {
        Company: exp.company,
        Duration: exp.duration,
        Description: exp.description,
      },
    })),
    Education: resume.education.map((edu, idx) => ({
      [`${idx + 1}. ${edu.degree}`]: {
        Field: edu.field,
        Institution: edu.institution,
        Graduation: edu.graduationYear || 'Not specified',
      },
    })),
    Certifications: resume.certifications?.length ? resume.certifications : 'None listed',
    Links: {
      LinkedIn: resume.linkedIn || 'Not provided',
      Portfolio: resume.portfolio || 'Not provided',
    },
  };
};

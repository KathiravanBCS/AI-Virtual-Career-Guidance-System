/**
 * resume-ai.config.ts
 * AI generation functions for resume form fields.
 * Mirrors the pattern of groq.config.ts but scoped to resume content.
 */

import axios, { type AxiosError } from 'axios';

// ==================== CONFIGURATION ====================

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const RESUME_AI_MODEL = 'llama-3.3-70b-versatile';
const RESUME_AI_FALLBACK_MODEL = 'llama-3.1-8b-instant';

if (!GROQ_API_KEY) {
  console.error('[resume-ai.config] VITE_GROQ_API_KEY is not set. AI generation will fail.');
}

// ==================== TYPES ====================

export type ResumeFieldType =
  | 'profileObjective'
  | 'professionalSummary'
  | 'workExperience'
  | 'project'
  | 'skills'
  | 'custom';

export interface ResumeAIContext {
  jobTitle?: string;
  company?: string;
  projectName?: string;
  sectionTitle?: string;
  existingContent?: string;
}

// ==================== INTERNAL API CALL ====================

const callResumeGroqApi = async (prompt: string, model = RESUME_AI_MODEL): Promise<string> => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1024,
        top_p: 0.95,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        timeout: 30000,
      }
    );
    return response.data.choices[0].message.content as string;
  } catch (err) {
    const axiosErr = err as AxiosError;
    // Try fallback model once on failure
    if (model !== RESUME_AI_FALLBACK_MODEL) {
      return callResumeGroqApi(prompt, RESUME_AI_FALLBACK_MODEL);
    }
    throw new Error(
      `Resume AI API error: ${axiosErr.response?.status ?? 'unknown'} — ${axiosErr.message}`
    );
  }
};

/**
 * Strips common markdown prefixes from bullet lines and returns non-empty lines.
 */
const parseBulletLines = (raw: string): string[] =>
  raw
    .split('\n')
    .map((line) => line.replace(/^[\-•*\d]+[.)]\s*/, '').trim())
    .filter((line) => line.length > 5);

// ==================== GENERATION FUNCTIONS ====================

/**
 * Generate a concise profile objective for the resume header.
 */
export const generateProfileObjective = async (userInput: string): Promise<string> => {
  const prompt = `You are an expert resume writer. Write a compelling, concise professional objective for a resume profile section.

USER'S INFORMATION:
${userInput}

REQUIREMENTS:
- Keep it to 1–2 sentences, maximum 60 words
- Avoid first-person pronouns ("I", "my", "me") — use professional tone
- Focus on role, key skills, and career goal
- Avoid clichés like "motivated", "hardworking", or "team player"
- Sound specific, confident, and results-oriented

Return ONLY the objective text, nothing else.`;

  return (await callResumeGroqApi(prompt)).trim();
};

/**
 * Generate a professional summary paragraph (for the Summary section).
 */
export const generateProfessionalSummary = async (
  userInput: string,
  existingContent?: string
): Promise<string> => {
  const contextNote = existingContent?.trim()
    ? `\nEXISTING CONTENT TO IMPROVE:\n${existingContent}\n`
    : '';

  const prompt = `You are an expert resume writer. Write a compelling professional summary for a resume.

USER'S BACKGROUND:
${userInput}${contextNote}

REQUIREMENTS:
- Write 3–5 sentences (80–130 words)
- Mention years of experience, core domain, key technologies/skills, and a top achievement
- Use strong action verbs and quantify achievements where possible
- No bullet points — write as a single flowing paragraph
- Avoid first-person pronouns ("I", "my", "me")
- Sound unique, specific, and employer-ready

Return ONLY the summary paragraph, nothing else.`;

  return (await callResumeGroqApi(prompt)).trim();
};

/**
 * Generate ATS-optimized bullet points for a work experience entry.
 */
export const generateWorkExperienceDescriptions = async (
  userInput: string,
  jobTitle?: string,
  company?: string
): Promise<string[]> => {
  const contextLines = [
    jobTitle ? `Job Title: ${jobTitle}` : '',
    company ? `Company: ${company}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `You are an expert resume writer. Generate 4–5 impactful bullet points for a work experience section.

${contextLines ? `ROLE CONTEXT:\n${contextLines}\n` : ''}USER'S DESCRIPTION OF RESPONSIBILITIES:
${userInput}

REQUIREMENTS:
- Each bullet starts with a strong past-tense action verb (Led, Built, Optimized, Reduced, Delivered, Automated, etc.)
- Include measurable results or scale (%, numbers, team size) wherever possible
- Be specific — no vague statements like "Worked on various projects"
- Each bullet is one concise sentence (15–25 words)
- Tailor language to a professional software, business, or relevant industry audience

Return ONLY the bullet points, one per line, no dashes or numbers.`;

  const raw = await callResumeGroqApi(prompt);
  return parseBulletLines(raw);
};

/**
 * Generate bullet points describing a project entry.
 */
export const generateProjectDescriptions = async (
  userInput: string,
  projectName?: string
): Promise<string[]> => {
  const prompt = `You are an expert resume writer. Generate 3–4 concise bullet points for a project in a resume.

${projectName ? `PROJECT NAME: ${projectName}\n` : ''}USER'S DESCRIPTION:
${userInput}

REQUIREMENTS:
- First bullet: what was built and its purpose
- Following bullets: key technologies, features, and measurable impact
- Use action verbs (Built, Designed, Implemented, Reduced, Improved, Deployed, etc.)
- Be specific about tech stack, user impact, or performance metrics
- Each bullet is one concise sentence (15–25 words)

Return ONLY the bullet points, one per line, no dashes or numbers.`;

  const raw = await callResumeGroqApi(prompt);
  return parseBulletLines(raw);
};

/**
 * Generate a categorized, ATS-optimized skills list.
 */
export const generateSkillsList = async (userInput: string): Promise<string[]> => {
  const prompt = `You are an expert resume writer. Generate a clean, ATS-optimized skills list for a resume.

USER'S SKILLS AND BACKGROUND:
${userInput}

REQUIREMENTS:
- Group related skills into clear categories (e.g., "Languages: JavaScript, Python, TypeScript")
- Include technical hard skills only — omit soft skills
- Each line follows the format: "Category: Skill1, Skill2, Skill3"
- Include 4–6 category lines
- 3–6 skills per line
- Use standard industry naming conventions (e.g., "Node.js" not "nodejs")

Return ONLY the skills lines, one per line, no dashes or numbering.`;

  const raw = await callResumeGroqApi(prompt);
  return parseBulletLines(raw);
};

/**
 * Generate content lines for a custom resume section.
 */
export const generateCustomSectionContent = async (
  userInput: string,
  sectionTitle?: string
): Promise<string[]> => {
  const prompt = `You are an expert resume writer. Generate professional content for a custom resume section titled "${sectionTitle || 'Custom Section'}".

USER'S INPUT:
${userInput}

REQUIREMENTS:
- Generate 3–5 relevant, concise entries appropriate for this section
- Keep each line professional and resume-appropriate (10–25 words each)
- Match the content style to the section title
- If the section is about certifications, include credential name and year
- If it's about languages, list language and proficiency level

Return ONLY the content lines, one per line, no dashes or numbering.`;

  const raw = await callResumeGroqApi(prompt);
  return parseBulletLines(raw);
};

// ==================== MODAL PROMPT CONFIG ====================

/**
 * Per-field configuration for the AI modal UI (title, labels, placeholders).
 */
export const RESUME_AI_PROMPTS: Record<
  ResumeFieldType,
  {
    modalTitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    description: string;
  }
> = {
  profileObjective: {
    modalTitle: 'AI — Generate Profile Objective',
    inputLabel: 'Describe your professional profile',
    inputPlaceholder:
      'e.g., I am a frontend developer with 3 years in React and TypeScript, seeking a senior full-stack role at a product company...',
    description:
      'Tell us about your background, current role, and career goals. We will generate a concise objective for your resume header.',
  },
  professionalSummary: {
    modalTitle: 'AI — Generate Professional Summary',
    inputLabel: 'Describe your experience and key achievements',
    inputPlaceholder:
      'e.g., 5 years in backend development with Node.js and Python, built APIs serving 1M+ users, led a team of 4 engineers, AWS certified...',
    description:
      'Provide your experience, key skills, and top achievements. We will craft a powerful professional summary paragraph.',
  },
  workExperience: {
    modalTitle: 'AI — Generate Work Experience Bullets',
    inputLabel: 'Describe your responsibilities and achievements',
    inputPlaceholder:
      'e.g., Developed REST APIs, improved database query performance by 40%, led migration from monolith to microservices, mentored 2 junior devs...',
    description:
      'Describe what you did in this role and your key results. We will generate ATS-optimized bullet points.',
  },
  project: {
    modalTitle: 'AI — Generate Project Description',
    inputLabel: 'Describe your project in detail',
    inputPlaceholder:
      'e.g., Built an e-commerce platform with React frontend, Node.js API, and PostgreSQL. 10K+ users, Stripe payments, 99.9% uptime...',
    description:
      'Provide details about your project, tech stack, and impact. We will generate compelling bullet points.',
  },
  skills: {
    modalTitle: 'AI — Generate Skills List',
    inputLabel: 'List your technical skills, tools, and background',
    inputPlaceholder:
      'e.g., JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Git, CI/CD, REST APIs, GraphQL...',
    description:
      'Provide your tech stack, tools, and domain expertise. We will generate a categorized, ATS-friendly skills list.',
  },
  custom: {
    modalTitle: 'AI — Generate Section Content',
    inputLabel: 'Describe what to include in this section',
    inputPlaceholder:
      'e.g., AWS Certified Developer (2023), Google Cloud Associate (2022), Microsoft Azure Fundamentals (2021)...',
    description:
      "Describe the content for this section and we'll generate professional, resume-ready entries.",
  },
};

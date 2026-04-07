import { useRef, useState } from 'react';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBooks,
  IconBriefcase,
  IconCheck,
  IconCloudUpload,
  IconDownload,
  IconFile,
  IconFileSpreadsheet,
  IconFileText,
  IconLink,
  IconLoader2,
  IconStar,
  IconX,
  IconAlertCircle,
  IconSparkles,
  IconArrowRight,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ExtractedResume } from '@/config/groq.config';
import { processResumeFile } from '@/utils/resumeAIIntegration';
import { estimateTokens, validateResumeFile } from '@/utils/resumeExtractor';

import { useDocumentConversion } from './api/useDocumentConversion';

interface ImportedResume {
  id: string;
  name: string;
  uploadDate: string;
  status: 'success' | 'processing' | 'error';
  fileName: string;
  processingTime?: number;
  tokenCount?: number;
  error?: string;
  extractedData?: ExtractedResume;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return IconFile;
  if (['doc', 'docx'].includes(ext ?? '')) return IconFileText;
  if (['xls', 'xlsx'].includes(ext ?? '')) return IconFileSpreadsheet;
  return IconFile;
};

const EXTRACT_FEATURES = [
  { icon: IconBriefcase, label: 'Work Experience', desc: 'Roles, companies, durations' },
  { icon: IconBooks, label: 'Education', desc: 'Degrees, institutions, fields' },
  { icon: IconStar, label: 'Skills & Expertise', desc: 'Technical and soft skills' },
  { icon: IconLink, label: 'Projects & Links', desc: 'Portfolio, GitHub, demos' },
  { icon: IconFile, label: 'Personal Info', desc: 'Name, email, contact details' },
  { icon: IconDownload, label: 'Certifications', desc: 'Professional credentials' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: ImportedResume['status']; primaryHex: string }> = ({
  status,
  primaryHex,
}) => {
  if (status === 'success')
    return (
      <Badge
        size="sm"
        variant="light"
        color="teal"
        leftSection={<IconCheck size={11} />}
        style={{ fontWeight: 600 }}
      >
        Success
      </Badge>
    );
  if (status === 'processing')
    return (
      <Badge
        size="sm"
        variant="light"
        color="blue"
        leftSection={
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <IconLoader2 size={11} />
          </motion.div>
        }
        style={{ fontWeight: 600 }}
      >
        Processing
      </Badge>
    );
  return (
    <Badge
      size="sm"
      variant="light"
      color="red"
      leftSection={<IconX size={11} />}
      style={{ fontWeight: 600 }}
    >
      Failed
    </Badge>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const ResumeImportPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const navigate = useNavigate();

  const primary = theme.colors[theme.primaryColor];
  const primaryHex = primary?.[6] ?? '#ff9d54';

  const [resumes, setResumes] = useState<ImportedResume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: convertDocument } = useDocumentConversion();

  const processFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validation = validateResumeFile(file);
      if (!validation.valid) {
        setResumes((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            uploadDate: new Date().toLocaleDateString(),
            status: 'error',
            fileName: file.name,
            error: validation.error,
            processingTime: 0,
          },
        ]);
        continue;
      }

      const newResume: ImportedResume = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        uploadDate: new Date().toLocaleDateString(),
        status: 'processing',
        fileName: file.name,
      };
      setResumes((prev) => [...prev, newResume]);

      try {
        const startTime = performance.now();
        const conversionResult = await convertDocument(file);
        const endTime = performance.now();
        const processingTime = endTime - startTime;

        if (!conversionResult?.text) {
          setResumes((prev) =>
            prev.map((r) =>
              r.id === newResume.id
                ? { ...r, status: 'error', error: 'Failed to convert document to text' }
                : r
            )
          );
          continue;
        }

        try {
          const textFile = new File([conversionResult.text], file.name, { type: 'text/plain' });
          const result = await processResumeFile(textFile, true);

          if (result.success && result.extractedData) {
            setResumes((prev) =>
              prev.map((r) =>
                r.id === newResume.id
                  ? {
                      ...r,
                      status: 'success',
                      extractedData: result.extractedData,
                      processingTime: processingTime + (result.processingTime ?? 0),
                      tokenCount: result.tokenCount,
                    }
                  : r
              )
            );
          } else {
            setResumes((prev) =>
              prev.map((r) =>
                r.id === newResume.id
                  ? { ...r, status: 'error', error: result.error ?? 'Failed to analyze resume' }
                  : r
              )
            );
          }
        } catch (aiError) {
          setResumes((prev) =>
            prev.map((r) =>
              r.id === newResume.id
                ? { ...r, status: 'error', error: (aiError as Error).message ?? 'AI analysis failed' }
                : r
            )
          );
        }
      } catch (conversionError) {
        setResumes((prev) =>
          prev.map((r) =>
            r.id === newResume.id
              ? {
                  ...r,
                  status: 'error',
                  error: (conversionError as Error).message ?? 'Document conversion failed',
                }
              : r
          )
        );
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleImportResume = (resume: ImportedResume) => {
    if (resume.status === 'success' && resume.extractedData) {
      navigate('/resume-builder', {
        state: { importedData: resume.extractedData },
      });
    }
  };

  const pageBg = isDark
    ? 'linear-gradient(145deg, #141414 0%, #1e1e1e 100%)'
    : 'linear-gradient(145deg, #f8f8f8 0%, #ffffff 100%)';

  return (
    <Box style={{ background: pageBg, minHeight: '100vh' }}>
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* ── Header ── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Group gap="md" align="center">
              <ThemeIcon
                size={50}
                radius="xl"
                style={{
                  background: `linear-gradient(135deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
                  color: 'white',
                  boxShadow: `0 6px 20px ${primaryHex}40`,
                }}
              >
                <IconSparkles size={26} />
              </ThemeIcon>
              <div>
                <Title
                  order={2}
                  style={{
                    color: primaryHex,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                  }}
                >
                  Resume Import
                </Title>
                <Text size="sm" c="dimmed" mt={2}>
                  AI-powered extraction from PDF, DOCX, and more
                </Text>
              </div>
            </Group>
          </motion.div>

          {/* ── Drop Zone ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <Box
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: isDragOver
                  ? `${primaryHex}12`
                  : isDark
                    ? 'rgba(255,255,255,0.02)'
                    : '#fafafa',
                border: `2px dashed ${isDragOver ? primaryHex : isDark ? 'rgba(255,255,255,0.1)' : '#ddd'}`,
                borderRadius: '16px',
                padding: '52px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isDragOver ? `0 0 0 4px ${primaryHex}18` : 'none',
              }}
            >
              <motion.div animate={{ y: isDragOver ? -6 : 0 }} transition={{ duration: 0.25 }}>
                <ThemeIcon
                  size={60}
                  radius="xl"
                  style={{
                    background: isDragOver
                      ? `${primaryHex}20`
                      : isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0',
                    color: isDragOver ? primaryHex : isDark ? '#aaa' : '#888',
                    margin: '0 auto 16px',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <IconCloudUpload size={30} />
                </ThemeIcon>
              </motion.div>

              <Text fw={700} size="lg" style={{ color: isDragOver ? primaryHex : undefined, letterSpacing: '-0.02em' }}>
                {isDragOver ? 'Drop your resume here' : 'Upload your resume'}
              </Text>
              <Text size="sm" c="dimmed" mt={6}>
                Drag & drop or click to browse — PDF, DOC, DOCX, TXT
              </Text>

              <Button
                mt="lg"
                variant="light"
                style={{
                  background: `${primaryHex}15`,
                  color: primaryHex,
                  border: `1px solid ${primaryHex}30`,
                  fontWeight: 600,
                  borderRadius: '10px',
                  pointerEvents: 'none',
                }}
              >
                Browse Files
              </Button>
            </Box>
          </motion.div>

          {/* ── Resume Results ── */}
          <AnimatePresence>
            {resumes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Stack gap="md">
                  <Text fw={700} size="sm" style={{ color: primaryHex, letterSpacing: '-0.01em' }}>
                    Imported Resumes ({resumes.length})
                  </Text>

                  {resumes.map((resume, index) => {
                    const FileIcon = getFileIcon(resume.fileName);
                    return (
                      <motion.div
                        key={resume.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.06 }}
                      >
                        <Box
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                            border: `1px solid ${
                              resume.status === 'success'
                                ? 'rgba(34,197,94,0.3)'
                                : resume.status === 'error'
                                  ? 'rgba(239,68,68,0.3)'
                                  : isDark ? 'rgba(255,255,255,0.08)' : '#e5e5e5'
                            }`,
                            borderRadius: '14px',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Header row */}
                          <Group px="lg" py="md" justify="space-between" wrap="nowrap">
                            <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                              <ThemeIcon
                                size={40}
                                radius="md"
                                style={{
                                  background: `${primaryHex}15`,
                                  color: primaryHex,
                                  flexShrink: 0,
                                }}
                              >
                                <FileIcon size={20} />
                              </ThemeIcon>
                              <div style={{ minWidth: 0 }}>
                                <Text fw={700} size="sm" truncate style={{ letterSpacing: '-0.01em' }}>
                                  {resume.name}
                                </Text>
                                <Text size="xs" c="dimmed" truncate>
                                  {resume.fileName} · {resume.uploadDate}
                                </Text>
                              </div>
                            </Group>

                            <Group gap="sm" style={{ flexShrink: 0 }}>
                              <StatusBadge status={resume.status} primaryHex={primaryHex} />
                              {resume.status === 'success' && (
                                <Button
                                  size="xs"
                                  rightSection={<IconArrowRight size={13} />}
                                  onClick={() => handleImportResume(resume)}
                                  style={{
                                    background: `linear-gradient(135deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
                                    color: 'white',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: `0 4px 12px ${primaryHex}35`,
                                  }}
                                >
                                  Use Resume
                                </Button>
                              )}
                            </Group>
                          </Group>

                          {/* Processing indicator */}
                          {resume.status === 'processing' && (
                            <Box px="lg" pb="md">
                              <Progress
                                value={100}
                                animated
                                size="sm"
                                radius="xl"
                                color={primaryHex}
                                style={{ opacity: 0.7 }}
                              />
                              <Text size="xs" c="dimmed" mt={6}>
                                Extracting resume data with AI…
                              </Text>
                            </Box>
                          )}

                          {/* Error message */}
                          {resume.status === 'error' && resume.error && (
                            <Box
                              px="lg"
                              pb="md"
                              style={{
                                borderTop: `1px solid rgba(239,68,68,0.15)`,
                              }}
                            >
                              <Group gap="xs" mt="sm">
                                <IconAlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                                <Text size="xs" c="red">{resume.error}</Text>
                              </Group>
                            </Box>
                          )}

                          {/* Success extracted data summary */}
                          {resume.status === 'success' && resume.extractedData && (
                            <Box
                              px="lg"
                              pb="md"
                              style={{ borderTop: `1px solid rgba(34,197,94,0.15)` }}
                            >
                              <Group gap="xl" mt="sm" wrap="wrap">
                                {resume.extractedData.workExperience && (
                                  <Group gap={6}>
                                    <IconBriefcase size={13} style={{ color: primaryHex }} />
                                    <Text size="xs" c="dimmed">
                                      {resume.extractedData.workExperience.length} Experience{resume.extractedData.workExperience.length !== 1 ? 's' : ''}
                                    </Text>
                                  </Group>
                                )}
                                {resume.extractedData.topSkills?.length > 0 && (
                                  <Group gap={6}>
                                    <IconStar size={13} style={{ color: primaryHex }} />
                                    <Text size="xs" c="dimmed">
                                      {resume.extractedData.topSkills.length} Skills
                                    </Text>
                                  </Group>
                                )}
                                {resume.extractedData.projects && (
                                  <Group gap={6}>
                                    <IconLink size={13} style={{ color: primaryHex }} />
                                    <Text size="xs" c="dimmed">
                                      {resume.extractedData.projects.length} Projects
                                    </Text>
                                  </Group>
                                )}
                                {resume.tokenCount && (
                                  <Text size="xs" c="dimmed">
                                    ~{resume.tokenCount} tokens · {((resume.processingTime ?? 0) / 1000).toFixed(1)}s
                                  </Text>
                                )}
                              </Group>
                            </Box>
                          )}
                        </Box>
                      </motion.div>
                    );
                  })}
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── What We Extract ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <Box
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#ebebeb'}`,
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <Group
                gap="sm"
                px="lg"
                py="md"
                style={{
                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
                  background: isDark ? 'rgba(255,255,255,0.02)' : `${primaryHex}08`,
                }}
              >
                <ThemeIcon
                  size={32}
                  radius="md"
                  style={{ background: `${primaryHex}18`, color: primaryHex }}
                >
                  <IconSparkles size={16} />
                </ThemeIcon>
                <Text fw={700} size="sm">What We Extract</Text>
              </Group>

              <Box px="lg" py="lg">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {EXTRACT_FEATURES.map(({ icon: Icon, label, desc }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.04, duration: 0.3 }}
                    >
                      <Group
                        gap="sm"
                        style={{
                          padding: '10px 12px',
                          background: isDark ? 'rgba(255,255,255,0.03)' : `${primaryHex}07`,
                          borderRadius: '10px',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : `${primaryHex}18`}`,
                        }}
                        align="flex-start"
                      >
                        <IconCheck size={15} style={{ color: primaryHex, flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <Text size="xs" fw={600}>{label}</Text>
                          <Text size="xs" c="dimmed">{desc}</Text>
                        </div>
                      </Group>
                    </motion.div>
                  ))}
                </div>
              </Box>
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default ResumeImportPage;
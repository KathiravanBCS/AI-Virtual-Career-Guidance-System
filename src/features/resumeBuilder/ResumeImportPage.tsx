import { useRef, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Container,
  Group,
  Paper,
  Progress,
  Stack,
  Table,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBooks,
  IconBriefcase,
  IconCheck,
  IconDownload,
  IconFile,
  IconFileSpreadsheet,
  IconFileText,
  IconLink,
  IconStar,
  IconX,
} from '@tabler/icons-react';
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

export const ResumeImportPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ImportedResume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: convertDocument } = useDocumentConversion();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    // Process each file
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      // Validate file
      const validation = validateResumeFile(file);
      if (!validation.valid) {
        const newResume: ImportedResume = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          uploadDate: new Date().toLocaleDateString(),
          status: 'error',
          fileName: file.name,
          error: validation.error,
          processingTime: 0,
        };
        setResumes((prev) => [...prev, newResume]);
        continue;
      }

      // Create processing entry
      const newResume: ImportedResume = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        uploadDate: new Date().toLocaleDateString(),
        status: 'processing',
        fileName: file.name,
      };

      setResumes((prev) => [...prev, newResume]);

      // Step 1: Convert document to text using backend
      try {
        const startTime = performance.now();
        const conversionResult = await convertDocument(file);
        const endTime = performance.now();
        const processingTime = endTime - startTime;

        if (!conversionResult?.text) {
          setResumes((prev) =>
            prev.map((resume) =>
              resume.id === newResume.id
                ? {
                    ...resume,
                    status: 'error',
                    error: 'Failed to convert document to text',
                  }
                : resume
            )
          );
          continue;
        }

        // Step 2: Process converted text with AI
        try {
          // Create a temporary file with the converted text for AI processing
          const textFile = new File([conversionResult.text], file.name, { type: 'text/plain' });
          const result = await processResumeFile(textFile, true);

          if (result.success && result.extractedData) {
            setResumes((prev) =>
              prev.map((resume) =>
                resume.id === newResume.id
                  ? {
                      ...resume,
                      status: 'success',
                      extractedData: result.extractedData,
                      processingTime: processingTime + (result.processingTime || 0),
                      tokenCount: result.tokenCount,
                    }
                  : resume
              )
            );
          } else {
            setResumes((prev) =>
              prev.map((resume) =>
                resume.id === newResume.id
                  ? {
                      ...resume,
                      status: 'error',
                      error: result.error || 'Failed to analyze resume',
                    }
                  : resume
              )
            );
          }
        } catch (aiError) {
          setResumes((prev) =>
            prev.map((resume) =>
              resume.id === newResume.id
                ? {
                    ...resume,
                    status: 'error',
                    error: (aiError as Error).message || 'AI analysis failed',
                  }
                : resume
            )
          );
        }
      } catch (conversionError) {
        setResumes((prev) =>
          prev.map((resume) =>
            resume.id === newResume.id
              ? {
                  ...resume,
                  status: 'error',
                  error: (conversionError as Error).message || 'Document conversion failed',
                }
              : resume
          )
        );
      }
    }

    setIsUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportResume = (resume: ImportedResume) => {
    if (resume.status === 'success' && resume.extractedData) {
      // Transform extracted data to match resume store format
      const importedData = transformExtractedDataToResumeFormat(resume.extractedData);
      navigate('/resume-builder', { state: { importedData } });
    }
  };

  const transformExtractedDataToResumeFormat = (extractedData: ExtractedResume) => {
    return {
      profile: {
        name: extractedData.candidateName || '',
        email: extractedData.email || '',
        phone: extractedData.phone || '',
        location: extractedData.location || '',
        url: extractedData.portfolio || extractedData.linkedIn || '',
        summary: extractedData.summary || '',
      },
      summary: {
        content: extractedData.summary || '',
      },
      workExperiences: (extractedData.workExperience || []).map((exp) => ({
        company: exp.company || '',
        jobTitle: exp.jobTitle || '',
        date: exp.duration || '',
        descriptions: [
          exp.fullDescription || exp.description || '',
          ...(exp.keyResponsibilities || []),
          ...(exp.achievements || []),
        ].filter(Boolean),
      })),
      educations: (extractedData.education || []).map((edu) => ({
        school: edu.institution || '',
        degree: edu.degree || '',
        gpa: edu.cgpa || '',
        date: edu.graduationYear || '',
        descriptions: [edu.field || ''].filter(Boolean),
      })),
      projects: (extractedData.projects || []).map((proj) => ({
        project: proj.name || '',
        date: proj.description || '',
        descriptions: [
          proj.fullDescription || proj.description || '',
          ...(proj.technologies || []),
          ...(proj.keyFeatures || []),
        ].filter(Boolean),
      })),
      skills: {
        featuredSkills: (extractedData.topSkills || [])
          .slice(0, 6)
          .map((skill) => ({
            skill: skill,
            rating: 4,
          }))
          .concat(
            Array(6 - Math.min(6, extractedData.topSkills?.length || 0))
              .fill(0)
              .map(() => ({ skill: '', rating: 4 }))
          ),
        descriptions: extractedData.topSkills || [],
      },
      custom: {
        sections:
          extractedData.certifications && extractedData.certifications.length > 0
            ? [
                {
                  title: 'Certifications',
                  descriptions: extractedData.certifications,
                },
              ]
            : [
                {
                  title: 'Custom Section',
                  descriptions: [],
                },
              ],
      },
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <IconCheck size={18} />;
      case 'error':
        return <IconX size={18} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.primaryColor;
      case 'error':
        return 'red';
      case 'processing':
        return theme.primaryColor;
      default:
        return 'gray';
    }
  };

  const getBackgroundColor = () => {
    return colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0];
  };

  const getPaperBackground = () => {
    return colorScheme === 'dark' ? theme.colors.dark[6] : undefined;
  };

  const getBoxBackground = () => {
    return colorScheme === 'dark' ? `${theme.colors[theme.primaryColor][8]}40` : theme.colors[theme.primaryColor][0];
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={1} size="h2" c={theme.primaryColor}>
            Import Resume
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Upload your existing resume to auto-fill your profile
          </Text>
        </div>

        {/* Upload Section */}
        <Paper
          p="xl"
          radius="md"
          withBorder
          bg={getPaperBackground()}
          style={{
            border: `2px dashed ${theme.colors[theme.primaryColor][5]}`,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = theme.colors[theme.primaryColor][9];
            e.currentTarget.style.opacity = '0.05';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.opacity = '1';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.opacity = '1';
            const files = e.dataTransfer.files;
            if (fileInputRef.current) {
              fileInputRef.current.files = files;
              const event = new Event('change', { bubbles: true });
              fileInputRef.current.dispatchEvent(event);
            }
          }}
        >
          <Stack gap="md" align="center">
            <IconFile size={48} color={theme.colors[theme.primaryColor][5]} />
            <div>
              <Title order={3} size="h5" mb="xs" c={theme.primaryColor}>
                Drag and drop your resume
              </Title>
              <Text size="sm" c="dimmed" mb="lg">
                Supports: PDF, TXT, DOCX
              </Text>
            </div>
            <Button onClick={handleUploadClick} leftSection={<IconDownload size={18} />} color={theme.primaryColor}>
              Select Resume
            </Button>
          </Stack>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Paper>

        {/* Uploaded Resumes */}
        {resumes.length > 0 && (
          <div>
            <Title order={3} size="h5" mb="md" c={theme.primaryColor}>
              Imported Resumes ({resumes.length})
            </Title>

            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>File Name</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Upload Date</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {resumes.map((resume) => (
                  <Table.Tr key={resume.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <IconFile size={20} />
                        <Text size="sm">{resume.fileName}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {resume.status === 'processing' && (
                          <>
                            <Progress value={66} size="sm" style={{ flex: 1 }} />
                          </>
                        )}
                        <Badge
                          color={getStatusColor(resume.status)}
                          leftSection={getStatusIcon(resume.status)}
                          variant="light"
                        >
                          {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                        </Badge>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{resume.uploadDate}</Text>
                    </Table.Td>
                    <Table.Td>
                      {resume.status === 'success' && (
                        <Button size="xs" variant="light" onClick={() => handleImportResume(resume)}>
                          Use This Resume
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {/* Extracted Data Preview */}
            {resumes.some((r) => r.status === 'success' && r.extractedData) && (
              <div style={{ marginTop: '2rem' }}>
                <Group justify="space-between" align="center" mb="md">
                  <Title order={3} size="h5" c={theme.primaryColor}>
                    Extracted Information
                  </Title>
                  <Button
                    size="sm"
                    onClick={() => {
                      const successResume = resumes.find((r) => r.status === 'success' && r.extractedData);
                      if (successResume) handleImportResume(successResume);
                    }}
                    color={theme.primaryColor}
                  >
                    Import to Builder
                  </Button>
                </Group>
                {resumes
                  .filter((r) => r.status === 'success' && r.extractedData)
                  .map((resume) => (
                    <Paper key={resume.id} p="lg" radius="md" withBorder mb="md" bg={getPaperBackground()}>
                      <Group justify="space-between" mb="md">
                        <div style={{ flex: 1 }}>
                          <Text fw={600} size="md" mb="xs">
                            {resume.extractedData?.candidateName || 'Name not found'}
                          </Text>
                          <Group gap="md" mb="md">
                            <div>
                              <Text size="xs" c="dimmed">
                                Email
                              </Text>
                              <Text size="sm">{resume.extractedData?.email || 'Not found'}</Text>
                            </div>
                            {resume.extractedData?.phone && (
                              <div>
                                <Text size="xs" c="dimmed">
                                  Phone
                                </Text>
                                <Text size="sm">{resume.extractedData.phone}</Text>
                              </div>
                            )}
                            {resume.extractedData?.location && (
                              <div>
                                <Text size="xs" c="dimmed">
                                  Location
                                </Text>
                                <Text size="sm">{resume.extractedData.location}</Text>
                              </div>
                            )}
                            <div>
                              <Text size="xs" c="dimmed">
                                Experience
                              </Text>
                              <Text size="sm">{resume.extractedData?.totalYearsExperience || 0} years</Text>
                            </div>
                          </Group>

                          {/* Skills */}
                          {resume.extractedData?.topSkills && resume.extractedData.topSkills.length > 0 && (
                            <Stack gap="xs" mb="md">
                              <Text size="xs" c="dimmed" mb="xs">
                                All Skills ({resume.extractedData.topSkills.length})
                              </Text>
                              <Group gap="xs">
                                {resume.extractedData.topSkills.map((skill, idx) => (
                                  <Badge
                                    key={idx}
                                    size="sm"
                                    variant="light"
                                    color={idx < 5 ? theme.primaryColor : 'gray'}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </Group>
                            </Stack>
                          )}

                          {/* Work Experience */}
                          {resume.extractedData?.workExperience && resume.extractedData.workExperience.length > 0 && (
                            <Stack gap="xs" mb="md">
                              <Text size="xs" c="dimmed" fw={500} mb="xs">
                                Work Experience ({resume.extractedData.workExperience.length})
                              </Text>
                              <Stack gap="sm">
                                {resume.extractedData.workExperience.map((exp, idx) => (
                                  <Paper
                                    key={idx}
                                    p="md"
                                    radius="sm"
                                    withBorder
                                    style={{
                                      backgroundColor: getBoxBackground(),
                                      borderColor: `${theme.colors[theme.primaryColor][5]}40`,
                                    }}
                                  >
                                    <Group justify="space-between" mb="xs">
                                      <div>
                                        <Text size="sm" fw={600}>
                                          {exp.jobTitle}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                          {exp.company} • {exp.duration}
                                        </Text>
                                      </div>
                                    </Group>

                                    {exp.fullDescription && (
                                      <Text size="xs" mb="xs" style={{ lineHeight: 1.5 }}>
                                        {exp.fullDescription}
                                      </Text>
                                    )}

                                    {exp.keyResponsibilities && exp.keyResponsibilities.length > 0 && (
                                      <Stack gap="xs">
                                        <Text size="xs" fw={500} c="dimmed">
                                          Key Responsibilities:
                                        </Text>
                                        {exp.keyResponsibilities.map((resp, i) => (
                                          <Group key={i} gap="xs">
                                            <IconBriefcase size={14} color={theme.colors[theme.primaryColor][5]} />
                                            <Text size="xs">{resp}</Text>
                                          </Group>
                                        ))}
                                      </Stack>
                                    )}

                                    {exp.achievements && exp.achievements.length > 0 && (
                                      <Stack gap="xs" mt="xs">
                                        <Text size="xs" fw={500} c="dimmed">
                                          Achievements:
                                        </Text>
                                        {exp.achievements.map((ach, i) => (
                                          <Group key={i} gap="xs">
                                            <IconCheck size={14} color={theme.colors[theme.primaryColor][5]} />
                                            <Text size="xs">{ach}</Text>
                                          </Group>
                                        ))}
                                      </Stack>
                                    )}
                                  </Paper>
                                ))}
                              </Stack>
                            </Stack>
                          )}

                          {/* Projects */}
                          {resume.extractedData?.projects && resume.extractedData.projects.length > 0 && (
                            <Stack gap="xs" mb="md">
                              <Text size="xs" c="dimmed" fw={500} mb="xs">
                                Projects ({resume.extractedData.projects.length})
                              </Text>
                              <Stack gap="sm">
                                {resume.extractedData.projects.map((proj, idx) => (
                                  <Paper
                                    key={idx}
                                    p="md"
                                    radius="sm"
                                    withBorder
                                    style={{
                                      backgroundColor: getBoxBackground(),
                                      borderColor: `${theme.colors[theme.primaryColor][5]}30`,
                                    }}
                                  >
                                    <Group justify="space-between" mb="xs">
                                      <Text size="sm" fw={600}>
                                        {proj.name}
                                      </Text>
                                    </Group>

                                    {proj.fullDescription && (
                                      <Text size="xs" mb="xs" style={{ lineHeight: 1.5 }}>
                                        {proj.fullDescription}
                                      </Text>
                                    )}

                                    {proj.technologies && proj.technologies.length > 0 && (
                                      <div>
                                        <Text size="xs" fw={500} c="dimmed" mb="xs">
                                          Technologies:
                                        </Text>
                                        <Group gap="xs">
                                          {proj.technologies.map((tech, i) => (
                                            <Badge key={i} size="xs" variant="light" color={theme.primaryColor}>
                                              {tech}
                                            </Badge>
                                          ))}
                                        </Group>
                                      </div>
                                    )}

                                    {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                                      <Stack gap="xs">
                                        <Text size="xs" fw={500} c="dimmed">
                                          Key Features:
                                        </Text>
                                        {proj.keyFeatures.map((feat, i) => (
                                          <Group key={i} gap="xs">
                                            <IconStar size={14} color={theme.colors[theme.primaryColor][5]} />
                                            <Text size="xs">{feat}</Text>
                                          </Group>
                                        ))}
                                      </Stack>
                                    )}

                                    {proj.links && Object.keys(proj.links).length > 0 && (
                                      <Group gap="xs" mt="xs">
                                        {proj.links.github && (
                                          <Button
                                            size="xs"
                                            variant="light"
                                            component="a"
                                            href={proj.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            GitHub
                                          </Button>
                                        )}
                                        {proj.links.demo && (
                                          <Button
                                            size="xs"
                                            variant="light"
                                            component="a"
                                            href={proj.links.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Live Demo
                                          </Button>
                                        )}
                                        {proj.links.website && (
                                          <Button
                                            size="xs"
                                            variant="light"
                                            component="a"
                                            href={proj.links.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Website
                                          </Button>
                                        )}
                                      </Group>
                                    )}
                                  </Paper>
                                ))}
                              </Stack>
                            </Stack>
                          )}

                          {/* Education */}
                          {resume.extractedData?.education && resume.extractedData.education.length > 0 && (
                            <Stack gap="xs" mb="md">
                              <Text size="xs" c="dimmed" fw={500} mb="xs">
                                Education
                              </Text>
                              <Stack gap="xs">
                                {resume.extractedData.education.map((edu, idx) => (
                                  <Paper
                                    key={idx}
                                    p="sm"
                                    radius="sm"
                                    withBorder
                                    style={{
                                      backgroundColor: getBoxBackground(),
                                      borderColor: `${theme.colors[theme.primaryColor][5]}20`,
                                    }}
                                  >
                                    <Text size="sm" fw={500}>
                                      {edu.degree} in {edu.field}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                      {edu.institution}
                                    </Text>
                                  </Paper>
                                ))}
                              </Stack>
                            </Stack>
                          )}

                          {/* Token Count & Processing Time */}
                          <Group gap="lg" mt="md">
                            {resume.tokenCount && (
                              <Text size="xs" c="dimmed">
                                📊 ~{resume.tokenCount} tokens
                              </Text>
                            )}
                            {resume.processingTime && (
                              <Text size="xs" c="dimmed">
                                ⏱ {(resume.processingTime / 1000).toFixed(2)}s
                              </Text>
                            )}
                          </Group>
                        </div>
                      </Group>
                    </Paper>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <Paper
          p="lg"
          radius="md"
          withBorder
          bg={getPaperBackground()}
          style={{
            borderColor: `${theme.colors[theme.primaryColor][5]}40`,
          }}
        >
          <Title order={3} size="h5" mb="md" c={theme.primaryColor}>
            What We Extract
          </Title>
          <Stack gap="sm">
            <Group gap="sm">
              <IconCheck size={20} color={theme.colors[theme.primaryColor][5]} />
              <Text size="sm">Personal information (name, email, phone)</Text>
            </Group>
            <Group gap="sm">
              <IconCheck size={20} color={theme.colors[theme.primaryColor][5]} />
              <Text size="sm">Work experience and job descriptions</Text>
            </Group>
            <Group gap="sm">
              <IconCheck size={20} color={theme.colors[theme.primaryColor][5]} />
              <Text size="sm">Education history and qualifications</Text>
            </Group>
            <Group gap="sm">
              <IconCheck size={20} color={theme.colors[theme.primaryColor][5]} />
              <Text size="sm">Skills and technical expertise</Text>
            </Group>
            <Group gap="sm">
              <IconCheck size={20} color={theme.colors[theme.primaryColor][5]} />
              <Text size="sm">Professional summary and certifications</Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ResumeImportPage;

import { useRef, useState } from 'react';

import { Avatar, Badge, Button, Container, Group, Paper, Progress, Stack, Table, Text, Title } from '@mantine/core';
import { IconCheck, IconDownload, IconFile, IconX } from '@tabler/icons-react';

interface ImportedResume {
  id: string;
  name: string;
  uploadDate: string;
  status: 'success' | 'processing' | 'error';
  fileName: string;
  extractedData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export const ResumeImportPage: React.FC = () => {
  const [resumes, setResumes] = useState<ImportedResume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    // Simulate file processing
    Array.from(files).forEach((file) => {
      const newResume: ImportedResume = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        uploadDate: new Date().toLocaleDateString(),
        status: 'processing',
        fileName: file.name,
      };

      setResumes((prev) => [...prev, newResume]);

      // Simulate processing completion
      setTimeout(() => {
        setResumes((prev) =>
          prev.map((resume) =>
            resume.id === newResume.id
              ? {
                  ...resume,
                  status: 'success',
                  extractedData: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+1 (555) 000-0000',
                  },
                }
              : resume
          )
        );
        setIsUploading(false);
      }, 2000);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportResume = (resume: ImportedResume) => {
    console.log('Importing resume:', resume);
    // Navigate to resume builder with imported data
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
        return 'green';
      case 'error':
        return 'red';
      case 'processing':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={1} size="h2">
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
          style={{
            border: '2px dashed var(--mantine-color-gray-4)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = 'transparent';
            const files = e.dataTransfer.files;
            if (fileInputRef.current) {
              fileInputRef.current.files = files;
              const event = new Event('change', { bubbles: true });
              fileInputRef.current.dispatchEvent(event);
            }
          }}
        >
          <Stack gap="md" align="center">
            <div style={{ fontSize: '3rem' }}>📄</div>
            <div>
              <Title order={3} size="h5" mb="xs">
                Drag and drop your resume
              </Title>
              <Text size="sm" c="dimmed" mb="lg">
                or click below to browse (PDF, DOC, DOCX)
              </Text>
            </div>
            <Button onClick={handleUploadClick} leftSection={<IconDownload size={18} />}>
              Select Resume
            </Button>
          </Stack>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Paper>

        {/* Uploaded Resumes */}
        {resumes.length > 0 && (
          <div>
            <Title order={3} size="h5" mb="md">
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
                <Title order={3} size="h5" mb="md">
                  Extracted Information
                </Title>
                {resumes
                  .filter((r) => r.status === 'success' && r.extractedData)
                  .map((resume) => (
                    <Paper key={resume.id} p="lg" radius="md" withBorder>
                      <Group justify="space-between" mb="md">
                        <div>
                          <Text fw={500} size="sm">
                            {resume.extractedData?.name || 'Name not found'}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {resume.extractedData?.email || 'Email not found'}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {resume.extractedData?.phone || 'Phone not found'}
                          </Text>
                        </div>
                        <Button size="sm" onClick={() => handleImportResume(resume)}>
                          Import to Builder
                        </Button>
                      </Group>
                    </Paper>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <Paper p="lg" radius="md" withBorder>
          <Title order={3} size="h5" mb="md">
            What We Extract
          </Title>
          <Stack gap="sm">
            <Group gap="sm">
              <Badge color="blue" variant="light">
                ✓
              </Badge>
              <Text size="sm">Personal information (name, email, phone)</Text>
            </Group>
            <Group gap="sm">
              <Badge color="blue" variant="light">
                ✓
              </Badge>
              <Text size="sm">Work experience and job descriptions</Text>
            </Group>
            <Group gap="sm">
              <Badge color="blue" variant="light">
                ✓
              </Badge>
              <Text size="sm">Education history and qualifications</Text>
            </Group>
            <Group gap="sm">
              <Badge color="blue" variant="light">
                ✓
              </Badge>
              <Text size="sm">Skills and technical expertise</Text>
            </Group>
            <Group gap="sm">
              <Badge color="blue" variant="light">
                ✓
              </Badge>
              <Text size="sm">Professional summary and certifications</Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ResumeImportPage;

import { Anchor, Box, Group, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import {
  IconBook,
  IconBriefcase,
  IconClipboardList,
  IconHome,
  IconMessageCircle,
  IconSchool,
  IconSettings,
  IconStar,
  IconTrendingUp,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Icon mapping for breadcrumb segments
type IconComponent = React.ComponentType<{ size: number; stroke: number }>;

const getIconComponentForSegment = (segment: string): IconComponent | null => {
  const iconMap: { [key: string]: IconComponent } = {
    home: IconHome,
    users: IconUser,
    guidance: IconBriefcase,
    'learning-path': IconSchool,
    'career-guidance': IconTrendingUp,
    flashcards: IconStar,
    quiz: IconClipboardList,
    'resume-builder': IconBook,
    'master-data': IconUsers,
    'career-summary': IconMessageCircle,
    settings: IconSettings,
  };
  return iconMap[segment] || null;
};

export function BreadcrumbNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

    if (isDashboard) return [];

    const breadcrumbs = [{ label: 'Home', href: '/', segment: 'home' }];

    let path = '';
    pathSegments.forEach((segment) => {
      path += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ label, href: path, segment });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <Box
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        margin: 0,
        padding: '12px',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : '#fafbfc',
      }}
    >
      {breadcrumbs.map((breadcrumb, index, arr) => (
        <Group key={index} gap={6} align="center">
          <Anchor
            onClick={() => navigate(breadcrumb.href)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              color: index === arr.length - 1 ? theme.colors.gray[8] : theme.colors.gray[6],
              fontWeight: index === arr.length - 1 ? 600 : 400,
              fontSize: 14,
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => {
              if (index !== arr.length - 1) {
                (e.currentTarget as HTMLElement).style.color = theme.colors.blue[6];
              }
            }}
            onMouseLeave={(e) => {
              if (index !== arr.length - 1) {
                (e.currentTarget as HTMLElement).style.color = theme.colors.gray[6];
              }
            }}
          >
            {(() => {
              const IconComponent = getIconComponentForSegment(breadcrumb.segment);
              return IconComponent ? (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <IconComponent size={18} stroke={1.5} />
                </span>
              ) : null;
            })()}
            <Text component="span" size="sm">
              {breadcrumb.label}
            </Text>
          </Anchor>

          {index < arr.length - 1 && (
            <Text size="sm" c="gray" style={{ userSelect: 'none' }}>
              /
            </Text>
          )}
        </Group>
      ))}
    </Box>
  );
}

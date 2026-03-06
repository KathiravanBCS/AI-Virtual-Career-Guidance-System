import { useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  rem,
  TextInput,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconBell,
  IconHelp,
  IconLogout,
  IconMenu2,
  IconMessage,
  IconSearch,
  IconSend,
  IconSettings,
} from '@tabler/icons-react';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

import gmAicgLogo from '@/assets/gm-ai-cg-logo-back-with-name-removebg-preview.png';
import { LogoutButton } from '@/lib/auth/LogoutButton';
import { useAuth } from '@/lib/auth/useAuth';

import { MainNavigation } from './MainNavigation';
import classes from './TopNavbar.module.css';

interface TopNavbarProps {
  onChatClick?: () => void;
  sidebarOpened?: boolean;
  onSidebarToggle?: () => void;
}

export function TopNavbar({ onChatClick, sidebarOpened = false, onSidebarToggle }: TopNavbarProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [searchValue, setSearchValue] = useState('');
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPhotoUrl = () => {
    const currentUser = getAuth().currentUser;
    return currentUser?.photoURL || user?.photoURL;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.displayName || user.email;
    return (
      name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    );
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.displayName || user.email || 'User';
  };

  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isHiddenNavPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isHiddenNavPage) {
    return null;
  }

  return (
    <>
      {/* Top Navbar */}
      <Box
        component="nav"
        className={classes.navbar}
        style={{
          height: 56,
          backgroundColor: theme.colors[theme.primaryColor][4],
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
          display: 'flex',
          alignItems: 'center',
          padding: `0 ${rem(16)}`,
          gap: rem(16),
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* Left Section: Hamburger + Logo + Title */}
        <Group gap="md" align="center" wrap="nowrap" style={{ flex: 0, minWidth: 'auto' }}>
          {/* Hamburger Menu Button */}
          <Tooltip label="Menu">
            <UnstyledButton
              onClick={onSidebarToggle}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: rem(8),
                borderRadius: theme.radius.sm,
                color: 'white',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <IconMenu2 size={24} stroke={1.5} />
            </UnstyledButton>
          </Tooltip>

          {/* Logo */}
          <img
            src={gmAicgLogo}
            alt="GM-AICG"
            style={{
              maxHeight: 40,
              height: 'auto',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigate('/')}
          />

          {/* Title (hidden on mobile) */}
          {!isMobile && (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                style={{
                  color: 'white',
                  fontSize: rem(14),
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                GM-AICG
              </Box>
              <Box
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: rem(12),
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Career Guidance
              </Box>
            </Box>
          )}
        </Group>

        {/* Center Section: Search Box */}
        <Box style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <TextInput
              placeholder="Search resources, services..."
              leftSection={<IconSearch size={16} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: theme.radius.md,
                  fontSize: rem(13),
                },
              }}
            />
          </div>
        </Box>

        {/* Right Section: Chat, Settings, Feedback, Profile */}
        <Group gap="xs" align="center" wrap="nowrap" style={{ flex: 0, justifyContent: 'flex-end' }}>
          {/* Chat AI Button */}
          <Tooltip label="Chat with AI">
            <Button
              leftSection={<IconMessage size={18} />}
              size="sm"
              onClick={onChatClick}
              style={{
                backgroundColor: 'white',
                color: theme.colors[theme.primaryColor][6],
                fontWeight: 600,
              }}
            >
              {!isMobile && 'Chat AI'}
            </Button>
          </Tooltip>

          {/* Notifications Icon */}
          <Tooltip label="Notifications">
            <ThemeIcon
              variant="subtle"
              color="white"
              size="lg"
              style={{
                cursor: 'pointer',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <IconBell size={20} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>

          {/* Settings Icon */}
          <Tooltip label="Settings">
            <ThemeIcon
              variant="subtle"
              color="white"
              size="lg"
              style={{
                cursor: 'pointer',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => handleNavigate('/settings')}
            >
              <IconSettings size={20} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>

          {/* Feedback Icon */}
          <Tooltip label="Feedback">
            <ThemeIcon
              variant="subtle"
              color="white"
              size="lg"
              style={{
                cursor: 'pointer',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <IconSend size={20} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>

          {/* Help Icon */}
          <Tooltip label="Help">
            <ThemeIcon
              variant="subtle"
              color="white"
              size="lg"
              style={{
                cursor: 'pointer',
                transition: 'background-color 200ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <IconHelp size={20} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>

          {/* Profile Menu */}
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <UnstyledButton
                style={{
                  borderRadius: theme.radius.md,
                  padding: rem(4),
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: rem(8),
                }}
              >
                <Avatar
                  size={36}
                  radius="xl"
                  color={theme.primaryColor}
                  variant="filled"
                  src={getPhotoUrl()}
                  style={{
                    cursor: 'pointer',
                    border: '2px solid white',
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                {!isMobile && (
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      minWidth: 0,
                    }}
                  >
                    <Box
                      style={{
                        color: 'white',
                        fontSize: rem(12),
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 150,
                      }}
                    >
                      {getUserName()}
                    </Box>
                    <Box
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: rem(11),
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 150,
                      }}
                    >
                      {getUserEmail()}
                    </Box>
                  </Box>
                )}
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{getUserName()}</Menu.Label>
              <Menu.Item disabled>{getUserEmail()}</Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => handleNavigate('/settings')}
              >
                Settings
              </Menu.Item>
              <Menu.Item leftSection={<IconSend style={{ width: rem(14), height: rem(14) }} />}>Feedback</Menu.Item>
              <Menu.Item leftSection={<IconHelp style={{ width: rem(14), height: rem(14) }} />}>Help</Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                component="button"
              >
                <LogoutButton />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>
    </>
  );
}

import { useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  rem,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconBell,
  IconDotsVertical,
  IconFlame,
  IconHelp,
  IconLogout,
  IconMenu2,
  IconMessage,
  IconSearch,
  IconSend,
  IconSettings,
  IconSparkles,
  IconTrophy,
} from '@tabler/icons-react';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

import gmAicgLogowithblack from '@/assets/Black_bg_logo.png';
import gmAicgLogowithWhite from '@/assets/white_bg_logo.png';
import useGamification from '@/hooks/useGamification';
import { LogoutButton } from '@/lib/auth/LogoutButton';
import { useAuth } from '@/lib/auth/useAuth';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

import { MainNavigation } from './MainNavigation';
import classes from './TopNavbar.module.css';

interface TopNavbarProps {
  onChatClick?: () => void;
  sidebarOpened?: boolean;
  onSidebarToggle?: () => void;
}

export function TopNavbar({ onChatClick, sidebarOpened = false, onSidebarToggle }: TopNavbarProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { user: loggedInUser } = useLoggedInUser();

  const [searchValue, setSearchValue] = useState('');
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch gamification data
  const { points, streak } = useGamification({
    userId: loggedInUser?.id || 0,
    enableAutoRefresh: loggedInUser?.id ? true : false,
    refreshInterval: 60000,
  });

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
  const compactSearchWidth = isMobile ? 64 : 400;
  const navHeight = isMobile ? 64 : 56;

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
          minHeight: navHeight,
          backgroundColor:
            colorScheme === 'dark' ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][4],
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? `${rem(8)} ${rem(10)}` : `0 ${rem(16)}`,
          gap: isMobile ? rem(8) : rem(16),
          position: 'relative',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {/* Left Section: Hamburger + Logo + Title */}
        <Group
          gap={isMobile ? 'xs' : 'md'}
          align="center"
          wrap="nowrap"
          style={{ flex: 0, minWidth: 'auto', flexShrink: 0 }}
        >
          {/* Hamburger Menu Button */}
          <Tooltip label="Menu">
            <UnstyledButton
              onClick={onSidebarToggle}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? rem(6) : rem(8),
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
          {colorScheme === 'dark' ? (
            <img
              src={gmAicgLogowithWhite}
              alt="GM-AICG"
              style={{
                maxHeight: isMobile ? 60 : 80,
                height: 'auto',
                objectFit: 'contain',
                cursor: 'pointer',
              }}
              onClick={() => handleNavigate('/')}
            />
          ) : (
            <img
              src={gmAicgLogowithblack}
              alt="GM-AICG"
              style={{
                maxHeight: isMobile ? 60 : 80,
                height: 'auto',
                objectFit: 'contain',
                cursor: 'pointer',
              }}
              onClick={() => handleNavigate('/')}
            />
          )}

          {/* Title (hidden on mobile) */}
          {!isMobile && (
            <Box
              onClick={() => handleNavigate('/')}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: rem(2),
                minWidth: rem(140),
              }}
            >
              <Group gap={0} align="flex-end" wrap="nowrap" style={{ lineHeight: 1 }}>
                <Text
                  fw={900}
                  size="lg"
                  c="#0099FF"
                  style={{
                    fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  GM
                </Text>
                <Text
                  fw={900}
                  size="lg"
                  c="#FFA500"
                  style={{
                    fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  -AICG
                </Text>
              </Group>
              <Text
                fw={500}
                size="sm"
                c="rgba(255, 255, 255, 0.85)"
                style={{
                  fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                  letterSpacing: '0.2px',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                }}
              >
                Career Guidance
              </Text>
            </Box>
          )}
        </Group>

        {/* Center Section: Search Box */}
        <Box style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: compactSearchWidth }}>
            <TextInput
              placeholder={isMobile ? 'Search' : 'Search resources, services...'}
              leftSection={<IconSearch size={16} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: theme.radius.md,
                  fontSize: rem(13),
                  minHeight: isMobile ? rem(40) : undefined,
                  paddingRight: isMobile ? rem(10) : undefined,
                },
              }}
            />
          </div>
        </Box>

        {/* Right Section: Chat, Settings, Feedback, Profile */}
        <Group
          gap={isMobile ? 4 : 'xs'}
          align="center"
          wrap="nowrap"
          style={{ flex: 0, justifyContent: 'flex-end', flexShrink: 0 }}
        >
          {/* Chat AI Button */}
          <Tooltip label="Chat with AI">
            <Button
              leftSection={<IconSparkles size={20} color={theme.colors[theme.primaryColor][6]} />}
              size={isMobile ? 'compact-sm' : 'sm'}
              onClick={onChatClick}
              style={{
                backgroundColor: 'white',
                color: theme.colors[theme.primaryColor][6],
                fontWeight: 600,
                minWidth: isMobile ? rem(42) : undefined,
                paddingInline: isMobile ? rem(10) : undefined,
              }}
            >
              {!isMobile && 'Chat AI'}
            </Button>
          </Tooltip>

          {!isMobile && (
            <>
              {/* Streak Button */}
              <Tooltip label="Current Streak">
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => handleNavigate('/gamification')}
                  style={{
                    backgroundColor:
                      colorScheme === 'dark'
                        ? `${theme.colors[theme.primaryColor][8]}20`
                        : theme.colors[theme.primaryColor][0],
                    color:
                      colorScheme === 'dark'
                        ? theme.colors[theme.primaryColor][3]
                        : theme.colors[theme.primaryColor][6],
                    display: 'flex',
                    alignItems: 'center',
                    gap: rem(6),
                    padding: `${rem(6)} ${rem(12)}`,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${
                      colorScheme === 'dark' ? theme.colors[theme.primaryColor][5] : theme.colors[theme.primaryColor][2]
                    }`,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colorScheme === 'dark'
                        ? `${theme.colors[theme.primaryColor][8]}40`
                        : theme.colors[theme.primaryColor][1];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colorScheme === 'dark'
                        ? `${theme.colors[theme.primaryColor][8]}20`
                        : theme.colors[theme.primaryColor][0];
                  }}
                >
                  <IconFlame size={16} />
                  <Box style={{ fontSize: rem(12), fontWeight: 600 }}>{streak?.current_streak || 0}</Box>
                  <Box style={{ fontSize: rem(10), opacity: 0.8 }}>streak</Box>
                </Button>
              </Tooltip>

              {/* Points Button */}
              <Tooltip label="Total Points">
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => handleNavigate('/gamification')}
                  style={{
                    backgroundColor:
                      colorScheme === 'dark'
                        ? `${theme.colors[theme.primaryColor][8]}20`
                        : theme.colors[theme.primaryColor][0],
                    color:
                      colorScheme === 'dark'
                        ? theme.colors[theme.primaryColor][3]
                        : theme.colors[theme.primaryColor][6],
                    display: 'flex',
                    alignItems: 'center',
                    gap: rem(6),
                    padding: `${rem(6)} ${rem(12)}`,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${
                      colorScheme === 'dark' ? theme.colors[theme.primaryColor][5] : theme.colors[theme.primaryColor][2]
                    }`,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colorScheme === 'dark'
                        ? `${theme.colors[theme.primaryColor][8]}40`
                        : theme.colors[theme.primaryColor][1];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colorScheme === 'dark'
                        ? `${theme.colors[theme.primaryColor][8]}20`
                        : theme.colors[theme.primaryColor][0];
                  }}
                >
                  <IconTrophy size={16} />
                  <Box style={{ fontSize: rem(12), fontWeight: 600 }}>{points?.total_points || 0}</Box>
                  <Box style={{ fontSize: rem(10), opacity: 0.8 }}>points</Box>
                </Button>
              </Tooltip>
            </>
          )}

          {isMobile && (
            <Menu shadow="md" width={220} position="bottom-end">
              <Menu.Target>
                <ThemeIcon variant="subtle" color="white" size="lg" style={{ cursor: 'pointer' }}>
                  <IconDotsVertical size={20} stroke={1.5} />
                </ThemeIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Quick access</Menu.Label>
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
                  leftSection={<IconFlame style={{ width: rem(14), height: rem(14) }} />}
                  onClick={() => handleNavigate('/gamification')}
                >
                  {streak?.current_streak || 0} day streak
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrophy style={{ width: rem(14), height: rem(14) }} />}
                  onClick={() => handleNavigate('/gamification')}
                >
                  {points?.total_points || 0} points
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

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
        </Group>
      </Box>
    </>
  );
}

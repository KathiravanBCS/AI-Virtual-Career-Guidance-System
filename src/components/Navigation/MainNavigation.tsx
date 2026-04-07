import { useEffect, useMemo, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Center,
  Group,
  Menu,
  NavLink,
  rem,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconLayoutSidebar, IconLogout, IconSettings } from '@tabler/icons-react';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

import gmAicgLogowithblack from '@/assets/Black_bg_logo.png';
import gmAicgLogowitname from '@/assets/gm-ai-cg-logo-back-with-name-removebg-preview.png';
import gmAicgLogo from '@/assets/gm-ai-cg-logo.png';
import gmAicgLogowithWhite from '@/assets/white_bg_logo.png';
import { useNavigation } from '@/hooks/useNavigation';
import { LogoutButton } from '@/lib/auth/LogoutButton';
import { useAuth } from '@/lib/auth/useAuth';

import classes from './MainNavigation.module.css';

interface MainNavigationProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onLinkClick?: () => void;
}

export function MainNavigation({ collapsed, onToggle, onLinkClick }: MainNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { user } = useAuth();
  const { filteredNav } = useNavigation();

  useEffect(() => {
    // Refresh user data to ensure photoURL is loaded
    if (user) {
      user.reload().catch((error) => console.error('Error reloading user:', error));
    }
  }, [user]);

  const getPhotoUrl = () => {
    const currentUser = getAuth().currentUser;
    return currentUser?.photoURL || user?.photoURL;
  };

  // Helper for navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    if (onLinkClick) {
      onLinkClick();
    }
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

  // Highlight active states based on current path
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Check if any child link is active (for parent nav items)
  const isChildActive = (item: (typeof filteredNav)[0]) => {
    if (!item.links) return false;
    return item.links.some((link) => isActive(link.link));
  };

  // Check if nav item or any of its children is active
  const isNavItemActive = (item: (typeof filteredNav)[0]) => {
    return (item.link && isActive(item.link)) || isChildActive(item);
  };

  // State to control accordion - only one item open at a time
  const [openedItem, setOpenedItem] = useState<string | null>(() => {
    // Initialize with the active item
    const activeItem = filteredNav.find((item) => isNavItemActive(item));
    return activeItem?.label || null;
  });

  const links = filteredNav.map((item) => {
    const hasLinks = Array.isArray(item.links);

    if (collapsed) {
      // If item has nested links, use a Menu
      if (hasLinks) {
        const itemActive = isNavItemActive(item);
        return (
          <Menu key={item.label} position="right" trigger="hover" withArrow>
            <Menu.Target>
              <Tooltip label={item.label} position="right" withArrow transitionProps={{ duration: 0 }}>
                <UnstyledButton
                  style={{
                    width: rem(44),
                    height: rem(44),
                    borderRadius: theme.radius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: itemActive
                      ? theme.colors[theme.primaryColor][6]
                      : colorScheme === 'dark'
                        ? theme.colors.gray[3]
                        : 'inherit',
                    backgroundColor: itemActive
                      ? theme.colors[theme.primaryColor][0]
                      : colorScheme === 'dark'
                        ? 'transparent'
                        : 'transparent',
                  }}
                >
                  <item.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
                </UnstyledButton>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{item.label}</Menu.Label>
              {item.links?.map((subitem) => (
                <Menu.Item
                  key={subitem.label}
                  onClick={() => handleNavigate(subitem.link)}
                  data-active={isActive(subitem.link) || undefined}
                  leftSection={subitem.icon ? <subitem.icon size="1rem" stroke={1.5} /> : undefined}
                >
                  {subitem.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        );
      }

      // Single Item Collapsed
      return (
        <Tooltip label={item.label} position="right" withArrow transitionProps={{ duration: 0 }} key={item.label}>
          <UnstyledButton
            onClick={() => item.link && handleNavigate(item.link)}
            style={{
              width: rem(44),
              height: rem(44),
              borderRadius: theme.radius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color:
                item.link && isActive(item.link)
                  ? theme.colors[theme.primaryColor][6]
                  : colorScheme === 'dark'
                    ? theme.colors.gray[3]
                    : 'inherit',
              backgroundColor:
                item.link && isActive(item.link)
                  ? theme.colors[theme.primaryColor][0]
                  : colorScheme === 'dark'
                    ? 'transparent'
                    : 'transparent',
            }}
          >
            <item.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      );
    }

    // EXPANDED MODE
    if (!hasLinks) {
      const isItemActive = item.link && location.pathname === item.link;
      return (
        <NavLink
          key={item.label}
          active={isItemActive || false}
          label={item.label}
          leftSection={<item.icon size="1rem" stroke={1.5} />}
          onClick={() => item.link && handleNavigate(item.link)}
          styles={{
            root: {
              padding: `${rem(6)} ${rem(10)}`,
              borderRadius: theme.radius.md,
              marginBottom: rem(2),
              borderLeft: isItemActive ? `3px solid ${theme.colors[theme.primaryColor][5]}` : `3px solid transparent`,
              paddingLeft: isItemActive ? rem(7) : rem(10),
              backgroundColor: isItemActive
                ? colorScheme === 'dark'
                  ? `${theme.colors[theme.primaryColor][8]}40`
                  : theme.colors[theme.primaryColor][0]
                : 'transparent',
              color: isItemActive && colorScheme === 'dark' ? theme.colors[theme.primaryColor][3] : 'inherit',
              transition: 'all 200ms ease',
            },
            label: {
              fontSize: rem(14),
              fontWeight: 400,
            },
          }}
        />
      );
    }

    const itemActive = isNavItemActive(item);
    return (
      <NavLink
        key={item.label}
        label={item.label}
        leftSection={<item.icon size="1rem" stroke={1.5} />}
        childrenOffset={0}
        active={itemActive}
        opened={openedItem === item.label}
        onChange={(opened) => setOpenedItem(opened ? item.label : null)}
        styles={{
          root: {
            padding: `${rem(6)} ${rem(10)}`,
            borderRadius: theme.radius.md,
            marginBottom: rem(2),
            borderLeft: itemActive ? `3px solid ${theme.colors[theme.primaryColor][5]}` : `3px solid transparent`,
            paddingLeft: itemActive ? rem(7) : rem(10),
            backgroundColor: itemActive
              ? colorScheme === 'dark'
                ? `${theme.colors[theme.primaryColor][8]}40`
                : theme.colors[theme.primaryColor][0]
              : 'transparent',
            color: itemActive && colorScheme === 'dark' ? theme.colors[theme.primaryColor][3] : 'inherit',
            transition: 'all 200ms ease',
          },
          label: {
            fontSize: rem(14),
            fontWeight: 400,
          },
        }}
      >
        {item.links?.map((subitem) => {
          const isSubitemActive = isActive(subitem.link);
          return (
            <NavLink
              key={subitem.label}
              active={isSubitemActive}
              label={subitem.label}
              leftSection={subitem.icon ? <subitem.icon size="1rem" stroke={1.5} /> : undefined}
              onClick={() => handleNavigate(subitem.link)}
              styles={{
                root: {
                  padding: `${rem(6)} ${rem(10)}`,
                  borderRadius: theme.radius.md,
                  marginBottom: rem(2),
                  borderLeft: isSubitemActive
                    ? `3px solid ${theme.colors[theme.primaryColor][5]}`
                    : `3px solid transparent`,
                  paddingLeft: isSubitemActive ? rem(7) : rem(10),
                  backgroundColor: isSubitemActive
                    ? colorScheme === 'dark'
                      ? `${theme.colors[theme.primaryColor][8]}40`
                      : theme.colors[theme.primaryColor][0]
                    : 'transparent',
                  color: isSubitemActive && colorScheme === 'dark' ? theme.colors[theme.primaryColor][3] : 'inherit',
                  transition: 'all 200ms ease',
                },
                label: {
                  fontSize: rem(14),
                  fontWeight: 400,
                },
              }}
            />
          );
        })}
      </NavLink>
    );
  });

  return (
    <nav data-component="main-navigation" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Group
        h={90}
        px="md"
        justify={collapsed ? 'center' : 'space-between'}
        align="center"
        style={{
          borderBottom: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        }}
      >
        {collapsed ? (
          <Tooltip label="Expand Sidebar" position="right" withArrow>
            <UnstyledButton onClick={onToggle} className={classes.toggleButton}>
              <div className={classes.burger}>
                <IconLayoutSidebar style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
              </div>
              <div className={classes.logo}>
                {colorScheme === 'dark' ? (
                  <img
                    src={gmAicgLogowithWhite}
                    alt="GM-AICG"
                    style={{
                      maxHeight: 45,
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
                      maxHeight: 45,
                      height: 'auto',
                      objectFit: 'contain',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleNavigate('/')}
                  />
                )}
              </div>
            </UnstyledButton>
          </Tooltip>
        ) : (
          <Group gap="sm" align="center" wrap="nowrap">
            {colorScheme === 'dark' ? (
              <img
                src={gmAicgLogowithWhite}
                alt="GM-AICG"
                style={{
                  maxHeight: 45,
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
                  maxHeight: 45,
                  height: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer',
                }}
                onClick={() => handleNavigate('/')}
              />
            )}
            <Box onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
              <Group gap={0} align="flex-end" wrap="nowrap">
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
                fw={600}
                size="xs"
                c="dimmed"
                style={{
                  fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                  letterSpacing: '0.3px',
                  lineHeight: 1.2,
                }}
              >
                Career Guidance
              </Text>
            </Box>
            <Tooltip label="Collapse Sidebar" withArrow>
              <ActionIcon variant="transparent" color="gray" onClick={onToggle} visibleFrom="sm">
                <IconLayoutSidebar size="1.2rem" />
              </ActionIcon>
            </Tooltip>
          </Group>
        )}
      </Group>

      <ScrollArea
        data-section="nav-links"
        style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.white }}
      >
        <Stack gap={4} p={collapsed ? 'xs' : 'md'} align={collapsed ? 'center' : 'stretch'}>
          {links}
        </Stack>
      </ScrollArea>

      {isMobile && (
        <Box
          data-section="user-menu"
          p="md"
          style={{
            borderTop: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 2]}`,
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          }}
        >
          <Stack gap={0}>
            {!collapsed ? (
              <Menu shadow="md" width={200} position="top-start">
                <Menu.Target>
                  <UnstyledButton
                    style={{
                      padding: 'var(--mantine-spacing-xs)',
                      borderRadius: 'var(--mantine-radius-sm)',
                      width: '100%',
                      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : 'transparent',
                    }}
                  >
                    <Group wrap="nowrap">
                      <Avatar size={32} radius="xl" color={theme.primaryColor} variant="filled" src={getPhotoUrl()}>
                        {getUserInitials()}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text size="sm" fw={500} truncate="end">
                          {getUserName()}
                        </Text>
                        <Text c="dimmed" size="xs" truncate="end">
                          {getUserEmail()}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => handleNavigate('/settings')}
                  >
                    Settings
                  </Menu.Item>
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
            ) : (
              <Menu shadow="md" width={200} position="right">
                <Menu.Target>
                  <Center py="xs">
                    <Tooltip label={getUserName()} position="right" withArrow>
                      <Avatar size={32} radius="xl" color={theme.primaryColor} variant="filled" src={getPhotoUrl()}>
                        {getUserInitials()}
                      </Avatar>
                    </Tooltip>
                  </Center>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => handleNavigate('/settings')}
                  >
                    Settings
                  </Menu.Item>
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
            )}
          </Stack>
        </Box>
      )}
    </nav>
  );
}

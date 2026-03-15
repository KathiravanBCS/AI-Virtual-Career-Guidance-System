import { useState } from 'react';

import { Box, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Outlet, useLocation } from 'react-router-dom';

import { BreadcrumbNavigation } from '@/components/Navigation/BreadcrumbNavigation';
import { MainNavigation } from '@/components/Navigation/MainNavigation';
import { TopNavbar } from '@/components/Navigation/TopNavbar';

// Global styles to hide browser scrollbar
const globalStyles = `
  html, body, #root {
    overflow: hidden;
    height: 100vh;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
`;

export function Layout() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const location = useLocation();

  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isGuidancePage =
    location.pathname === '/guidance' ||
    (location.pathname.startsWith('/guidance') &&
      !location.pathname.includes('/new') &&
      !location.pathname.includes('/edit'));

  const isHiddenNavPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <style>{globalStyles}</style>

      <Box style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Top Navbar */}
        {!isHiddenNavPage && (
          <TopNavbar
            onChatClick={() => setIsChatDrawerOpen(true)}
            sidebarOpened={sidebarOpened}
            onSidebarToggle={() => setSidebarOpened(!sidebarOpened)}
          />
        )}

        {/* Main Content Area with Sidebar */}
        <Box style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
          {/* Sidebar - Show when opened or on desktop */}
          {!isHiddenNavPage && sidebarOpened && (
            <Box
              style={{
                width: sidebarCollapsed ? 80 : 250,
                borderRight: `1px solid ${theme.colors.gray[3]}`,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 200ms ease',
              }}
            >
              <MainNavigation
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                onLinkClick={() => isMobile && setSidebarOpened(false)}
              />
            </Box>
          )}

          {/* Content Area */}
          <Box style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Breadcrumb Navigation */}
            {!isHiddenNavPage && location.pathname !== '/' && location.pathname !== '/dashboard' && (
              <Box style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : '#fafbfc' }}>
                <BreadcrumbNavigation />
              </Box>
            )}

            {/* Content */}
            <Box
              style={{
                flex: 1,
                overflow: 'auto',
                padding: isGuidancePage ? 0 : 12,
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : '#ffffff',
              }}
            >
              <Outlet context={{ isChatDrawerOpen, setIsChatDrawerOpen }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.css';
import '@gfazioli/mantine-split-pane/styles.css';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './lib/auth/AuthProvider';
import { Router } from './Router';
import { ThemeProvider } from './theme/ThemeProvider';
import { NotificationProvider } from './features/gamification/context/NotificationContext';
import NotificationContainer from './features/gamification/components/NotificationContainer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="default">
          <NotificationProvider>
            <ModalsProvider>
              <Notifications position="bottom-right" />
              <NotificationContainer />
              <Router />
            </ModalsProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

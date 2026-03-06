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
          <ModalsProvider>
            <Notifications position="bottom-right" />
            <Router />
          </ModalsProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

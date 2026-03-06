import { createHashRouter, RouterProvider } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { ResumePreview } from './components/Resume/ResumePreview';
import { ForgotPasswordPage, SignUpPage } from './features/auth';
import { LoginPage } from './features/auth/pages/LoginPage';
import { CareerSummaryPage } from './features/careerSummary/pages/CareerSummaryPage';
import { ChatPage } from './features/chat/pages/ChatPage';
import { FlashcardGenerator } from './features/flashcards/components/FlashcardGenerator';
import { FlashcardDisplayPage } from './features/flashcards/pages/FlashcardDisplayPage';
import { FlashcardsPage } from './features/flashcards/pages/FlashcardsPage';
import { GuidancePage } from './features/guidance';
import { HomePage } from './features/home';
import { LeaderboardPage } from './features/leaderboard/pages/LeaderboardPage';
import { LearningPathDetailsPage } from './features/learningPath/pages/LearningPathDetailsPage';
import { LearningPathPage } from './features/learningPath/pages/LearningPathPage';
import { SkillsListPage } from './features/master/masterSkills/pages';
import { QuizGenerator } from './features/quiz/components/QuizGenerator';
import { QuizDisplayPage } from './features/quiz/pages/QuizDisplayPage';
import { QuizPage } from './features/quiz/pages/QuizPage';
import { ResumeBuilderPage } from './features/resumeBuilder/ResumeBuilderPage';
import { ResumeImportPage } from './features/resumeBuilder/ResumeImportPage';
import { CreateUserPage } from './features/users/pages/createUserPage';
import { UserEditPage } from './features/users/pages/UserEditPage';
import { UserListPage } from './features/users/pages/userListPage';
import { AuthGuard } from './lib/auth/AuthGuard';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { NotFoundPage } from './pages/NotFound.page';
import { SettingsPage } from './pages/Settings/SettingsPage';

const router = createHashRouter([
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'guidance',
        element: <GuidancePage />,
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <UserListPage />,
          },
          {
            path: 'new',
            element: <CreateUserPage />,
          },
          {
            path: 'edit/:userId',
            element: <UserEditPage />,
          },
        ],
      },
      {
        path: 'master/skills',
        children: [
          {
            index: true,
            element: <SkillsListPage />,
          },
        ],
      },
      {
        path: 'learning-path',
        children: [
          {
            index: true,
            element: <LearningPathPage />,
          },
          {
            path: ':id',
            element: <LearningPathDetailsPage />,
          },
          {
            path: ':id/module/:moduleIndex',
            element: <LearningPathDetailsPage />,
          },
        ],
      },
      {
        path: 'flashcards',
        children: [
          {
            index: true,
            element: <FlashcardsPage />,
          },
          {
            path: 'generate',
            element: <FlashcardGenerator />,
          },
          {
            path: 'display',
            element: <FlashcardDisplayPage />,
          },
        ],
      },
      {
        path: 'quiz',
        children: [
          {
            index: true,
            element: <QuizGenerator />,
          },
          {
            path: 'display',
            element: <QuizDisplayPage />,
          },
        ],
      },
      {
        path: 'skills',
        element: <SkillsListPage />,
      },
      {
        path: 'career-summary',
        element: <CareerSummaryPage />,
      },
      {
        path: 'ai-chat',
        element: <ChatPage />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'resume-builder',
        children: [
          {
            index: true,
            element: <ResumeBuilderPage />,
          },
        ],
      },
      {
        path: 'resume-preview',
        element: <ResumePreview />,
      },
      {
        path: 'resume-import',
        element: <ResumeImportPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

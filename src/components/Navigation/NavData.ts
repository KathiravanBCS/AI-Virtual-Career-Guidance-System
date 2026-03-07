import {
  IconAward,
  IconBadges,
  IconBook,
  IconBriefcase,
  IconBriefcase2,
  IconCards,
  IconChalkboardTeacher,
  IconDownload,
  IconFileCv,
  IconFileText,
  IconHome,
  IconLock,
  IconMessageCircle,
  IconSettings,
  IconShield,
  IconTarget,
  IconToolsKitchen2,
  IconTrophy,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';

export interface NavLink {
  label: string;
  link: string;
  icon?: typeof IconHome;
  countKey?: string;
}

export interface NavItem {
  label: string;
  icon: typeof IconHome;
  link?: string;
  links?: NavLink[];
}

export const navData: NavItem[] = [
  { label: 'Dashboard', icon: IconHome, link: '/' },
  {
    label: 'Guidance',
    icon: IconBriefcase2,
    links: [
      { label: 'Career Guidance', icon: IconTarget, link: '/guidance' },
      { label: 'Learning Paths', icon: IconBook, link: '/learning-path' },
      { label: 'Flashcards', icon: IconCards, link: '/flashcards' },
      { label: 'Quiz', icon: IconAward, link: '/quiz' },
    ],
  },
  {
    label: 'Resume Builder',
    icon: IconFileCv,
    links: [
      { label: 'Import Resume', icon: IconDownload, link: '/resume-import' },
      { label: 'Create Resume', icon: IconFileText, link: '/resume-builder' },
    ],
  },
  {
    label: 'Master Data',
    icon: IconChalkboardTeacher,
    links: [
      { label: 'Skills', icon: IconBadges, link: '/master/skills' },
      { label: 'Roles', icon: IconShield, link: '/master/roles' },
      { label: 'Permissions', icon: IconLock, link: '/master/permissions' },
      { label: 'Role Permissions', icon: IconUsers, link: '/master/role-permissions' },
    ],
  },
  { label: 'Career Summary', icon: IconBriefcase, link: '/career-summary' },
  { label: 'AI Chat', icon: IconMessageCircle, link: '/ai-chat' },
  { label: 'Leaderboard', icon: IconTrophy, link: '/leaderboard' },
  { label: 'Users', icon: IconUser, link: '/users' },
  { label: 'Settings', icon: IconSettings, link: '/settings' },
];

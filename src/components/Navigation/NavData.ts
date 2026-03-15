import {
  IconAward,
  IconBadges,
  IconBook,
  IconBrain,
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
  IconSearch,
  IconSettings,
  IconShield,
  IconTarget,
  IconToolsKitchen2,
  IconTrophy,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';

import { Action, Subject } from '@/lib/casl/types';

export interface NavLink {
  label: string;
  link: string;
  icon?: typeof IconHome;
  countKey?: string;
  permission?: {
    action: string;
    subject: string;
  };
}

export interface NavItem {
  label: string;
  icon: typeof IconHome;
  link?: string;
  links?: NavLink[];
  permission?: {
    action: string;
    subject: string;
  };
}

/**
 * Navigation menu structure with CASL permission requirements
 * Each item/link can have a permission check
 * Items without permissions are always visible
 */
export const navData: NavItem[] = [
  // Always visible - Dashboard
  { label: 'Dashboard', icon: IconHome, link: '/' },

  // Guidance Section - Available to most roles
  {
    label: 'Career',
    icon: IconBriefcase,
    permission: { action: Action.READ, subject: Subject.ASSESSMENT },
    links: [
      {
        label: 'Create Guidance',
        icon: IconBrain,
        link: '/ai-career-guidance',
        permission: { action: Action.READ, subject: Subject.CAREER },
      },
      {
        label: 'My Analyses',
        icon: IconBriefcase2,
        link: '/career-guidance',
        permission: { action: Action.READ, subject: Subject.CAREER },
      },
      {
        label: 'Job Recommendations',
        icon: IconSearch,
        link: '/job-recommendations',
        permission: { action: Action.READ, subject: Subject.CAREER },
      },
    ],
  },
  {
    label: 'Learning',
    icon: IconBriefcase2,
    permission: { action: Action.READ, subject: Subject.ASSESSMENT },
    links: [
      {
        label: 'AI Learning Guidance',
        icon: IconTarget,
        link: '/guidance',
        permission: { action: Action.READ, subject: Subject.CAREER },
      },
      {
        label: 'Learning Paths',
        icon: IconBook,
        link: '/learning-path',
        permission: { action: Action.READ, subject: Subject.LEARNING_PATH },
      },
      {
        label: 'Flashcards',
        icon: IconCards,
        link: '/flashcards',
        permission: { action: Action.READ, subject: Subject.ASSESSMENT },
      },
      {
        label: 'Quiz',
        icon: IconAward,
        link: '/quiz',
        permission: { action: Action.READ, subject: Subject.ASSESSMENT },
      },
    ],
  },

  // Resume Builder - Available to all users
  {
    label: 'Resume Builder',
    icon: IconFileCv,
    links: [
      { label: 'Import Resume', icon: IconDownload, link: '/resume-import' },
      { label: 'Create Resume', icon: IconFileText, link: '/resume-builder' },
    ],
  },

  // Master Data - Admin/Manager only
  {
    label: 'Master Data',
    icon: IconChalkboardTeacher,
    permission: { action: Action.READ, subject: Subject.SKILL },
    links: [
      {
        label: 'Skills',
        icon: IconBadges,
        link: '/master/skills',
        permission: { action: Action.READ, subject: Subject.SKILL },
      },
      {
        label: 'Roles',
        icon: IconShield,
        link: '/master/roles',
        permission: { action: Action.READ, subject: Subject.ROLE },
      },
      {
        label: 'Permissions',
        icon: IconLock,
        link: '/master/permissions',
        permission: { action: Action.MANAGE, subject: Subject.ROLEPERMISSION },
      },
      {
        label: 'Role Permissions',
        icon: IconUsers,
        link: '/master/role-permissions',
        permission: { action: Action.READ, subject: Subject.ROLEPERMISSION },
      },
    ],
  },

  // Career Summary
  {
    label: 'Career Summary',
    icon: IconBriefcase,
    link: '/career-summary',
    permission: { action: Action.READ, subject: Subject.CAREER },
  },

  // AI Chat
  { label: 'AI Chat', icon: IconMessageCircle, link: '/ai-chat' },

  // Gamification
  {
    label: 'Gamification',
    icon: IconTrophy,
    link: '/gamification',
    permission: { action: Action.READ, subject: Subject.ANALYTICS },
  },

  // Users Management - Admin/Manager only
  {
    label: 'Users',
    icon: IconUser,
    link: '/users',
    permission: { action: Action.READ, subject: Subject.USER },
  },

  // Settings
  { label: 'Settings', icon: IconSettings, link: '/settings' },
];

/**
 * Filter navigation items based on user permissions
 * @param items - Navigation items to filter
 * @param canAccess - Function to check if user can access a permission
 * @returns Filtered navigation items
 */
export function filterNavByPermissions(
  items: NavItem[],
  canAccess: (action: string, subject: string) => boolean
): NavItem[] {
  return items
    .filter((item) => {
      // If no permission required, always show
      if (!item.permission) return true;
      // Check if user can access this item
      return canAccess(item.permission.action, item.permission.subject);
    })
    .map((item) => {
      // Filter nested links by permission
      if (item.links) {
        return {
          ...item,
          links: item.links.filter((link) => {
            // If no permission required, always show
            if (!link.permission) return true;
            // Check if user can access this link
            return canAccess(link.permission.action, link.permission.subject);
          }),
        };
      }
      return item;
    })
    .filter((item) => {
      // Remove items with no visible links
      if (item.links && item.links.length === 0) return false;
      return true;
    });
}

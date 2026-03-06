// Mock User Data
import { User } from '@/features/users/types';

import { generateEmail, generateId, generatePersonName, generatePhoneNumber } from '../utils';

export const mockUsers: User[] = [
  {
    id: 1000,
    email: 'rajesh.kumar@example.com',
    first_name: 'Rajesh',
    last_name: 'Kumar',
    phone: '+919876543210',
    location: 'Bangalore',
    profile_picture_url: '',
    user_code: 'USR001',
    role_id: 1,
    status: 'active',
    is_active: true,
    created_at: '2023-01-15',
    last_login: '2024-02-20',
  },
  {
    id: 1001,
    email: 'priya.sharma@example.com',
    first_name: 'Priya',
    last_name: 'Sharma',
    phone: '+919876543211',
    location: 'Mumbai',
    profile_picture_url: '',
    user_code: 'USR002',
    role_id: 2,
    status: 'active',
    is_active: true,
    created_at: '2023-03-10',
    last_login: '2024-02-20',
  },
  {
    id: 1002,
    email: 'amit.singh@example.com',
    first_name: 'Amit',
    last_name: 'Singh',
    phone: '+919876543212',
    location: 'Delhi',
    profile_picture_url: '',
    user_code: 'USR003',
    role_id: 3,
    status: 'active',
    is_active: true,
    created_at: '2023-06-01',
    last_login: '2024-02-20',
  },
  {
    id: 1003,
    email: 'sneha.patel@example.com',
    first_name: 'Sneha',
    last_name: 'Patel',
    phone: '+919876543213',
    location: 'Pune',
    profile_picture_url: '',
    user_code: 'USR004',
    role_id: 3,
    status: 'active',
    is_active: true,
    created_at: '2023-04-20',
    last_login: '2024-02-20',
  },
  {
    id: 1004,
    email: 'arjun.reddy@example.com',
    first_name: 'Arjun',
    last_name: 'Reddy',
    phone: '+919876543214',
    location: 'Hyderabad',
    profile_picture_url: '',
    user_code: 'USR005',
    role_id: 3,
    status: 'inactive',
    is_active: false,
    created_at: '2023-05-15',
    last_login: '2024-01-10',
  },
];

// Generate additional mock users dynamically
export function generateMockUsers(count: number = 10): User[] {
  const users: User[] = [];
  const roleIds = [1, 2, 3];
  const statuses = ['active', 'inactive'];

  for (let i = 0; i < count; i++) {
    const id = generateId();
    const name = generatePersonName();
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || 'User';
    const email = generateEmail(name.toLowerCase().replace(/\s+/g, '.'));

    users.push({
      id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: generatePhoneNumber(),
      location: 'City',
      profile_picture_url: '',
      user_code: `USR${String(id).padStart(5, '0')}`,
      role_id: roleIds[Math.floor(Math.random() * roleIds.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      is_active: Math.random() > 0.3,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_login: new Date().toISOString(),
    });
  }

  return [...mockUsers, ...users];
}

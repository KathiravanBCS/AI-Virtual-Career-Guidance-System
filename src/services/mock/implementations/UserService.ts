// Mock User Service
import { CreateUserRequest, UpdateUserRequest, User } from '@/features/users/types';

import { BaseMockService } from '../BaseService';
import { mockUsers } from '../data/users';

export class MockUserService extends BaseMockService<User, CreateUserRequest, UpdateUserRequest> {
  constructor() {
    super(mockUsers, 1000, 300);
  }

  /**
   * Get all users with optional filtering
   */
  async getAll(filters?: { status?: string }): Promise<User[]> {
    let users = await super.getAll();

    if (filters?.status) {
      users = users.filter((u) => u.status === filters.status);
    }

    return users;
  }

  /**
   * Get users by status
   */
  async getByStatus(status: string): Promise<User[]> {
    return this.getAll({ status });
  }

  /**
   * Search users by name or email
   */
  async search(query: string): Promise<User[]> {
    const users = await super.getAll();
    const lowerQuery = query.toLowerCase();
    return users.filter(
      (u) =>
        u.first_name.toLowerCase().includes(lowerQuery) ||
        u.last_name.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const users = await super.getAll();
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User | undefined> {
    const users = await super.getAll();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Update user status
   */
  async updateStatus(id: number, status: string): Promise<User> {
    return this.update(id, { status } as UpdateUserRequest);
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<void> {
    return super.delete(id);
  }
}

export const mockUserService = new MockUserService();

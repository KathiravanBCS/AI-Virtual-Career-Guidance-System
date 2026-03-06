// Base Mock Service Class
import { delay } from './utils';

export abstract class BaseMockService<T extends { id?: number }, CreateDTO, UpdateDTO> {
  protected data: T[];
  protected nextId: number;
  protected delayMs: number;

  constructor(initialData: T[], startId: number = 1000, delayMs: number = 300) {
    this.data = JSON.parse(JSON.stringify(initialData)); // Deep copy
    this.nextId = startId;
    this.delayMs = delayMs;
  }

  /**
   * Get all items
   */
  async getAll(): Promise<T[]> {
    await delay(this.delayMs);
    return JSON.parse(JSON.stringify(this.data)); // Deep copy to prevent mutations
  }

  /**
   * Get item by ID
   */
  async getById(id: number): Promise<T> {
    await delay(this.delayMs);
    const item = this.data.find((item) => item.id === id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return JSON.parse(JSON.stringify(item));
  }

  /**
   * Create new item
   */
  async create(createData: CreateDTO): Promise<T> {
    await delay(this.delayMs);
    const newItem: T = {
      ...createData,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as T;
    this.data.push(newItem);
    return JSON.parse(JSON.stringify(newItem));
  }

  /**
   * Update existing item
   */
  async update(id: number, updateData: UpdateDTO): Promise<T> {
    await delay(this.delayMs);
    const item = this.data.find((item) => item.id === id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    const updated: T = {
      ...item,
      ...updateData,
      updatedAt: new Date(),
    } as T;
    const index = this.data.findIndex((item) => item.id === id);
    this.data[index] = updated;
    return JSON.parse(JSON.stringify(updated));
  }

  /**
   * Delete item
   */
  async delete(id: number): Promise<void> {
    await delay(this.delayMs);
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    this.data.splice(index, 1);
  }

  /**
   * Reset data (useful for testing)
   */
  reset(data: T[]): void {
    this.data = JSON.parse(JSON.stringify(data));
    this.nextId = 1000;
  }

  /**
   * Get count of items
   */
  async count(): Promise<number> {
    await delay(this.delayMs);
    return this.data.length;
  }

  /**
   * Check if item exists
   */
  async exists(id: number): Promise<boolean> {
    await delay(this.delayMs);
    return this.data.some((item) => item.id === id);
  }
}

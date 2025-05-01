import { users, type User, type InsertUser, type InsertHistory, type DownloadHistory } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Download history methods
  addDownloadHistory(downloadData: InsertHistory): Promise<DownloadHistory>;
  getDownloadHistory(): Promise<DownloadHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private downloadHistory: Map<number, DownloadHistory>;
  currentId: number;
  downloadHistoryId: number;

  constructor() {
    this.users = new Map();
    this.downloadHistory = new Map();
    this.currentId = 1;
    this.downloadHistoryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async addDownloadHistory(downloadData: InsertHistory): Promise<DownloadHistory> {
    const id = this.downloadHistoryId++;
    const downloadRecord = { ...downloadData, id } as DownloadHistory;
    this.downloadHistory.set(id, downloadRecord);
    return downloadRecord;
  }
  
  async getDownloadHistory(): Promise<DownloadHistory[]> {
    return Array.from(this.downloadHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const storage = new MemStorage();

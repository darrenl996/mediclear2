import { users, drugs, type User, type InsertUser, type Drug, type InsertDrug } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Drug-related methods
  getDrug(id: number): Promise<Drug | undefined>;
  getDrugByName(name: string): Promise<Drug | undefined>;
  createDrug(drug: InsertDrug): Promise<Drug>;
  updateDrug(id: number, drug: Partial<InsertDrug>): Promise<Drug | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drugs: Map<number, Drug>;
  private userCurrentId: number;
  private drugCurrentId: number;

  constructor() {
    this.users = new Map();
    this.drugs = new Map();
    this.userCurrentId = 1;
    this.drugCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Drug methods
  async getDrug(id: number): Promise<Drug | undefined> {
    return this.drugs.get(id);
  }
  
  async getDrugByName(name: string): Promise<Drug | undefined> {
    return Array.from(this.drugs.values()).find(
      (drug) => drug.name.toLowerCase() === name.toLowerCase(),
    );
  }
  
  async createDrug(insertDrug: InsertDrug): Promise<Drug> {
    const id = this.drugCurrentId++;
    const drug: Drug = { ...insertDrug, id };
    this.drugs.set(id, drug);
    return drug;
  }
  
  async updateDrug(id: number, drugUpdate: Partial<InsertDrug>): Promise<Drug | undefined> {
    const existingDrug = this.drugs.get(id);
    
    if (!existingDrug) {
      return undefined;
    }
    
    const updatedDrug = { ...existingDrug, ...drugUpdate };
    this.drugs.set(id, updatedDrug);
    return updatedDrug;
  }
}

export const storage = new MemStorage();

import {
  users,
  orders,
  measurements,
  type User,
  type UpsertUser,
  type Order,
  type InsertOrder,
  type Measurement,
  type InsertMeasurement,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Order operations
  getOrders(customerId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  
  // Measurement operations
  getMeasurements(customerId: string): Promise<Measurement | undefined>;
  createOrUpdateMeasurements(measurements: InsertMeasurement): Promise<Measurement>;
  
  // Admin operations
  getCustomers(): Promise<User[]>;
  getOrderStats(): Promise<{
    totalOrders: number;
    activeCustomers: number;
    pendingFittings: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Order operations
  async getOrders(customerId?: string): Promise<Order[]> {
    const query = db.select().from(orders).orderBy(desc(orders.createdAt));
    
    if (customerId) {
      return await query.where(eq(orders.customerId, customerId));
    }
    
    return await query;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  // Measurement operations
  async getMeasurements(customerId: string): Promise<Measurement | undefined> {
    const [measurement] = await db
      .select()
      .from(measurements)
      .where(eq(measurements.customerId, customerId))
      .orderBy(desc(measurements.updatedAt));
    return measurement;
  }

  async createOrUpdateMeasurements(measurementData: InsertMeasurement): Promise<Measurement> {
    const existing = await this.getMeasurements(measurementData.customerId);
    
    if (existing) {
      const [updated] = await db
        .update(measurements)
        .set({ ...measurementData, updatedAt: new Date() })
        .where(eq(measurements.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newMeasurement] = await db
      .insert(measurements)
      .values(measurementData)
      .returning();
    return newMeasurement;
  }

  // Admin operations
  async getCustomers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "customer"))
      .orderBy(desc(users.createdAt));
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    activeCustomers: number;
    pendingFittings: number;
  }> {
    const allOrders = await db.select().from(orders);
    const allCustomers = await db.select().from(users).where(eq(users.role, "customer"));
    
    const totalOrders = allOrders.length;
    const activeCustomers = allCustomers.length;
    const pendingFittings = allOrders.filter(order => 
      order.status === "fitting_scheduled"
    ).length;

    return {
      totalOrders,
      activeCustomers,
      pendingFittings,
    };
  }
}

export const storage = new DatabaseStorage();

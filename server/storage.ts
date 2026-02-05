import { db, pool } from "./db";
import {
  users, bookings, settings, menuItems,
  type User, type InsertUser,
  type Booking, type InsertBooking,
  type Settings, type InsertSettings,
  type MenuItem, type InsertMenuItem
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, password: string): Promise<void>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateSettings(updates: Partial<InsertSettings>): Promise<Settings>;
  initSettings(): Promise<Settings>;

  // Menu
  getMenuItems(): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  seedMenu(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUserPassword(id: number, password: string): Promise<void> {
    await db.update(users).set({ password }).where(eq(users.id, id));
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [updated] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updated;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  // Settings
  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings).limit(1);
    return setting;
  }

  async initSettings(): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) return existing;
    
    const [newSetting] = await db.insert(settings).values({
      isOpen: true,
      adminEmail: "admin@brunecafe.com"
    }).returning();
    return newSetting;
  }

  async updateSettings(updates: Partial<InsertSettings>): Promise<Settings> {
    const existing = await this.getSettings();
    if (!existing) return this.initSettings();

    const [updated] = await db
      .update(settings)
      .set(updates)
      .where(eq(settings.id, existing.id))
      .returning();
    return updated;
  }

  // Menu
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }

  async seedMenu(): Promise<void> {
    const existing = await this.getMenuItems();
    if (existing.length > 0) return;

    const menuData = [
      // Pizza
      { category: "Pizza", name: "Cheese & Charm (Margherita)", price: 195 },
      { category: "Pizza", name: "Veggie Supreme", price: 215 },
      { category: "Pizza", name: "Paneer Fusion", price: 245 },
      { category: "Pizza", name: "Fungi Feast (Mushroom)", price: 265 },
      // Bites
      { category: "Bites", name: "Cheese Garlic Bread", price: 125 },
      { category: "Bites", name: "Falafel Bite", price: 155 },
      { category: "Bites", name: "Chilli Cheese Melt Bite", price: 155 },
      { category: "Bites", name: "Crispy Melt Nachos", price: 145 },
      { category: "Bites", name: "Salted French Fries", price: 105 },
      { category: "Bites", name: "Peri Peri Fries", price: 115 },
      { category: "Bites", name: "Cheese Drizzle Fries", price: 145 },
      // Warm Sip
      { category: "Warm Sip", name: "Belgian Hot Cocoa", price: 125 },
      { category: "Warm Sip", name: "Signature Bournvita", price: 95 },
      { category: "Warm Sip", name: "Artisan Masala Chai", price: 55 },
      { category: "Warm Sip", name: "Elite House Black Tea", price: 45 },
      { category: "Warm Sip", name: "Majestic Lemon Mint Tea", price: 65 },
      { category: "Warm Sip", name: "Crystal Leaf Green Tea", price: 65 },
      // Gourmet Sandwich House
      { category: "Gourmet Sandwich House", name: "Signature Veg Grill", price: 115 },
      { category: "Gourmet Sandwich House", name: "Classic Bombay Masala Delight", price: 125 },
      { category: "Gourmet Sandwich House", name: "Paneer Buzz", price: 155 },
      { category: "Gourmet Sandwich House", name: "Loaded Corn Cheese", price: 135 },
      // Brew Collection
      { category: "Brew Collection", name: "Espresso Noir", price: 95 },
      { category: "Brew Collection", name: "Velvet Cappuccino", price: 115 },
      { category: "Brew Collection", name: "Caffe Latte", price: 135 },
      { category: "Brew Collection", name: "Mocha Milano", price: 145 },
      { category: "Brew Collection", name: "Americano", price: 95 },
      { category: "Brew Collection", name: "Hazelnut Brew", price: 135 },
      // Iced Artistry Bar
      { category: "Iced Artistry Bar", name: "Iced Americano Supreme", price: 115 },
      { category: "Iced Artistry Bar", name: "Iced Cloud Latte", price: 125 },
      { category: "Iced Artistry Bar", name: "Mocha Ice Drip", price: 145 },
      { category: "Iced Artistry Bar", name: "Cold Brew Signature", price: 125 },
      { category: "Iced Artistry Bar", name: "Oreo Luxe Shake", price: 125 },
      { category: "Iced Artistry Bar", name: "KitKat Crush", price: 135 },
      { category: "Iced Artistry Bar", name: "Hazelnut Cold Brew", price: 145 },
    ];

    for (const item of menuData) {
      await this.createMenuItem(item);
    }
  }
}

export const storage = new DatabaseStorage();

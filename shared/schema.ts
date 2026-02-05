import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(), // 'admin' or 'user'
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  isOpen: boolean("is_open").default(true).notNull(),
  adminEmail: text("admin_email").default("admin@brunecafe.com").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
});

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, status: true, createdAt: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Settings = typeof settings.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;

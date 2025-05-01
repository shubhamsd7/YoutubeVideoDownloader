import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// URL validation schema
export const URLSchema = z.object({
  url: z.string().url(),
});

// Video format type
export interface VideoFormat {
  formatId: string;
  extension: string;
  quality: string;
  qualityLabel?: string;
  type: string;
  filesize: number;
  fps?: number;
  title?: string;
}

// Video info type
export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  uploader: string;
  duration: number;
  formats: VideoFormat[];
}

// Download history schema
export const downloadHistory = pgTable("download_history", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(),
  formatId: text("format_id").notNull(),
  title: text("title"),
  extension: text("extension").notNull(),
  quality: text("quality").notNull(),
  type: text("type").notNull(),
  filesize: integer("filesize").notNull(),
  fps: integer("fps"),
  timestamp: timestamp("timestamp").notNull(),
});

// History insert schema
export const insertHistorySchema = createInsertSchema(downloadHistory).omit({
  id: true,
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type DownloadHistory = typeof downloadHistory.$inferSelect;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Store users for potential future authentication features
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Store cached drugs to avoid repeatedly hitting the FDA API
export const drugs = pgTable("drugs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  brand_name: text("brand_name"),
  active_ingredient: text("active_ingredient"),
  class: text("class"),
  data: jsonb("data").notNull(),
  last_updated: integer("last_updated").notNull(), // Unix timestamp
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDrugSchema = createInsertSchema(drugs).pick({
  name: true,
  brand_name: true,
  active_ingredient: true,
  class: true,
  data: true,
  last_updated: true,
});

// Create types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDrug = z.infer<typeof insertDrugSchema>;
export type Drug = typeof drugs.$inferSelect;

// API specific types for OpenFDA
export type MedicationSearchResult = {
  generic_name: string;
  brand_name?: string;
  active_ingredients?: Array<{name: string, strength: string}>;
  drug_class?: string;
  purpose?: string[];
  description?: string;
  route?: string[];
  dosage_form?: string[];
  warnings?: string[];
  warnings_and_cautions?: string[];
  boxed_warning?: string[];
  do_not_use?: string[];
  pregnancy_or_breastfeeding?: string[];
  usage_information?: string[];
  when_using?: string[];
  dosage_and_administration?: string[];
  drug_interactions?: string[];
  stop_use?: string[];
  side_effects?: string[];
  indications_and_usage?: string[];
  keep_out_of_reach_of_children?: string[];
  package_label_principal_display_panel?: string[];
  spl_product_data_elements?: string[];
  adverse_reactions?: string[];
  id?: string;
  set_id?: string;
  effective_time?: string;
  inactive_ingredient?: string[];
  openfda?: any;
  prescription_nonprescription?: string[];
  abuse_and_dependence?: string[];
};

export const medicationSearchResultSchema = z.object({
  generic_name: z.string().optional(),
  brand_name: z.string().optional(),
  active_ingredients: z.array(z.object({
    name: z.string(),
    strength: z.string()
  })).optional(),
  drug_class: z.string().optional(),
  purpose: z.array(z.string()).optional(),
  description: z.string().optional(),
  route: z.array(z.string()).optional(),
  dosage_form: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  warnings_and_cautions: z.array(z.string()).optional(),
  boxed_warning: z.array(z.string()).optional(),
  do_not_use: z.array(z.string()).optional(),
  pregnancy_or_breastfeeding: z.array(z.string()).optional(),
  usage_information: z.array(z.string()).optional(),
  when_using: z.array(z.string()).optional(),
  dosage_and_administration: z.array(z.string()).optional(),
  drug_interactions: z.array(z.string()).optional(),
  stop_use: z.array(z.string()).optional(),
  side_effects: z.array(z.string()).optional(),
  indications_and_usage: z.array(z.string()).optional(),
  keep_out_of_reach_of_children: z.array(z.string()).optional(),
  package_label_principal_display_panel: z.array(z.string()).optional(),
  spl_product_data_elements: z.array(z.string()).optional(),
  adverse_reactions: z.array(z.string()).optional(),
  id: z.string().optional(),
  set_id: z.string().optional(),
  effective_time: z.string().optional(),
  inactive_ingredient: z.array(z.string()).optional(),
  openfda: z.any().optional(),
  prescription_nonprescription: z.array(z.string()).optional(),
  abuse_and_dependence: z.array(z.string()).optional(),
});

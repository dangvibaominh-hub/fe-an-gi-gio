import type { UserRole, UserStatus } from "@/lib/types/auth";
import type {
  RecipeDifficulty,
  TechniqueIcon,
} from "@/lib/types/recipe";

export type RecipeStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";
export type RecipeSource = "ADMIN" | "SEED" | "GEMINI";
export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminRecipe {
  aiModel: string | null;
  baseServings: number;
  category: AdminCategory;
  cookTimeMinutes: number;
  createdAt: string;
  createdBy: { email: string | null; id: string } | null;
  description: string;
  difficulty: RecipeDifficulty;
  id: string;
  image: string;
  imageAlt: string;
  moderationStatus: ModerationStatus;
  slug: string;
  source: RecipeSource;
  status: RecipeStatus;
  title: string;
  updatedAt: string;
}

export interface AdminRecipeIngredient {
  amount: number;
  displayOrder: number;
  id: string;
  name: string;
  prepNote: string;
  unit: string;
}

export interface AdminRecipeStep {
  content: string;
  displayOrder: number;
  estimatedMinutes: number;
  id: string;
  isTricky: boolean;
  techniqueIcon: TechniqueIcon;
  timerSeconds: number | null;
}

export interface AdminRecipeDetail extends AdminRecipe {
  ingredients: AdminRecipeIngredient[];
  steps: AdminRecipeStep[];
}

export interface AdminRecipeIngredientInput {
  amount: number;
  name: string;
  prepNote: string;
  unit: string;
}

export interface AdminRecipeStepInput {
  content: string;
  estimatedMinutes: number;
  isTricky: boolean;
  techniqueIcon: TechniqueIcon;
  timerSeconds: number | null;
}

export interface AdminRecipeWriteInput {
  baseServings: number;
  categorySlug: string;
  cookTimeMinutes: number;
  description: string;
  difficulty: RecipeDifficulty;
  image: string;
  imageAlt: string;
  ingredients: AdminRecipeIngredientInput[];
  slug: string;
  status: RecipeStatus;
  steps: AdminRecipeStepInput[];
  title: string;
}

export interface AdminUser {
  avatarUrl: string | null;
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
  provider: "PASSWORD" | "GOOGLE";
  role: UserRole;
  status: UserStatus;
  updatedAt: string;
}

export interface AdminAuditLog {
  action: string;
  actorUserId: string | null;
  createdAt: string;
  details: Record<string, unknown>;
  entityId: string | null;
  entityType: "recipe" | "user";
  id: string;
}

export interface AdminRecipeFilters {
  limit?: number;
  moderationStatus?: ModerationStatus;
  page?: number;
  source?: RecipeSource;
  status?: RecipeStatus;
}

export interface AdminUserFilters {
  limit?: number;
  page?: number;
  role?: UserRole;
  status?: UserStatus;
}

export interface AdminAuditFilters {
  actorUserId?: string;
  entityType?: "recipe" | "user";
  limit?: number;
  page?: number;
}

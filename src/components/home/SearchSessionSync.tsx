"use client";

import { useEffect } from "react";

import type { RecipeMatchMap } from "@/lib/searchSession";
import { saveSearchSession } from "@/lib/searchSession";

export interface SearchSessionSyncProps {
  ingredients: string[];
  matches: RecipeMatchMap;
}

export function SearchSessionSync({
  ingredients,
  matches,
}: SearchSessionSyncProps) {
  useEffect(() => {
    saveSearchSession(ingredients, matches);
  }, [ingredients, matches]);

  return null;
}

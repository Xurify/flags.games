import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeText(text: string): string {
  if (!text) return text; // Handle empty string case
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

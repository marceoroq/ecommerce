import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPlainObject<T>(obj: T): T {
  // Converts the object to JSON and then parses it back.
  // This removes any methods or non-serializable properties,
  // leaving a POJO (Plain Old JavaScript Object).
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generates a delay for a specified number of milliseconds.
 * Useful for simulating network latency in async functions.
 * @param ms The number of milliseconds to wait.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

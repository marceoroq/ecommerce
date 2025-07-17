/**
 * Simple error handler for DAL (Data Access Layer)
 * - Automatically handles any type of thrown error
 * - Preserves original error as cause
 * - Provides consistent error logging
 */
export function handleDalError(error: unknown, context: string): never {
  // Safely extract error message (handles non-Error objects)
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";

  // Create new error with contextual information
  const dalError = new Error(`[DAL:${context}] ${errorMessage}`);

  // Standardize error properties
  dalError.name = "DalError"; // Easier error identification
  dalError.cause = error; // Preserve original error

  // Structured error logging (helps debugging)
  console.error(`[${new Date().toISOString()}] DAL Error (${context}):`, {
    message: errorMessage,
    type: error instanceof Error ? error.name : typeof error, // Error classification
    stack: error instanceof Error ? error.stack : undefined, // Stack trace if available
  });

  throw dalError; // Stop execution and bubble up the error
}

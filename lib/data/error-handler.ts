/**
 * Simple error handler for Repository
 * - Automatically handles any type of thrown error
 * - Preserves original error as cause
 * - Provides consistent error logging
 */
export function handleRepositoryError(error: unknown, context: string): never {
  // Safely extract error message (handles non-Error objects)
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";

  // Create new error with contextual information
  const repositoryError = new Error(`[Repository:${context}] ${errorMessage}`);

  // Standardize error properties
  repositoryError.name = "RepositoryError"; // Easier error identification
  repositoryError.cause = error; // Preserve original error

  // Structured error logging (helps debugging)
  console.error(
    `[${new Date().toISOString()}] Repository Error (${context}):`,
    {
      message: errorMessage,
      type: error instanceof Error ? error.name : typeof error, // Error classification
      stack: error instanceof Error ? error.stack : undefined, // Stack trace if available
    }
  );

  throw repositoryError; // Stop execution and bubble up the error
}

// Custom error interface with optional statusCode
export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  errors?: unknown[];
  keyValue?: Record<string, unknown>;
}

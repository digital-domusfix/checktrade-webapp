export type Nullable<T> = T | null;
export type ApiResponse<T> = { data: T; success: boolean; error?: string };

// Common Bunq API types

// Pagination response types
export interface BunqPaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface BunqPaginatedResponse<T> {
  data: T[];
  pagination: BunqPaginationMeta;
}
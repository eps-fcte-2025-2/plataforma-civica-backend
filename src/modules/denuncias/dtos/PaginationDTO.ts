export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface PaginateQuery {
  page?: number;
  pageSize?: number;
}

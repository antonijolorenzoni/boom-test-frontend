import { SortResponse } from './SortResponse';

export interface PageableResponse {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: number;
  sort: SortResponse;
  unpaged: boolean;
}

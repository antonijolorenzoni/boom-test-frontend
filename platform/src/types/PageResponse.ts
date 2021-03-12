import { PageableResponse } from './PageableResponse';
import { SortResponse } from './SortResponse';

export interface PageResponse<T> {
  content: Array<T>;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: boolean;
  numberOfElements: number;
  pageable: PageableResponse;
  size: number;
  sort: SortResponse;
  totalElements: number;
  totalPages: number;
}

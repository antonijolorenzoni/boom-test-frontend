export interface PhotographerOrdersRequest {
  code?: string;
  companyId?: number;
  dateFrom?: number;
  dateTo?: number;
  deliveryMethods?: string[];
  deliveryStatuses?: string[];
  filterOrganizationId?: number;
  page: number;
  pageSize: number;
  search?: string;
  sortDirection?: string;
  sortField?: string;
  states?: string[];
  title?: string;
}

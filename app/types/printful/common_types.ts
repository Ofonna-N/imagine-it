// Pagination information
export interface PrintfulPagination {
  total: number;
  offset: number;
  limit: number;
}

// Base response type for v2 API
export interface PrintfulV2BaseResponse<T> {
  data: T;
  _links: PrintfulV2Links;
  paging?: PrintfulPagination;
}

// HATEOAS Links structure (v2 API)
export interface PrintfulV2Link {
  href: string;
}

export interface PrintfulV2Links {
  self: PrintfulV2Link;
  first?: PrintfulV2Link;
  last?: PrintfulV2Link;
  next?: PrintfulV2Link;
  previous?: PrintfulV2Link;
  [key: string]: PrintfulV2Link | undefined;
}

// Error response type - keeping this as it might be used across both versions
export interface PrintfulErrorResponse {
  code: number;
  result: string;
  error: {
    reason: string;
    message: string;
  };
}

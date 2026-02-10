// types/wishlist.ts
export interface WishlistItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
    discount?: number;
    category: string;
    rating?: number;
  };
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  products: WishlistItem[];
  count: number;
}

export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  action: 'added' | 'removed';
  wishlist: Wishlist;
}

// types/review.ts
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    limit: number;
  };
}

export interface ReviewStatsResponse {
  success: boolean;
  stats: ReviewStats;
}

export interface CanReviewResponse {
  canReview: boolean;
  reason?: 'already_reviewed' | 'not_purchased';
  review?: Review;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

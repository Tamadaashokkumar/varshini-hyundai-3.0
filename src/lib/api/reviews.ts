// lib/api/reviews.ts
import axios from "axios";
import {
  ReviewsResponse,
  ReviewStatsResponse,
  CanReviewResponse,
  CreateReviewData,
  UpdateReviewData,
  Review,
} from "../../../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Create axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reviewAPI = {
  // Create a new review
  createReview: async (
    reviewData: CreateReviewData,
  ): Promise<{ success: boolean; message: string; review: Review }> => {
    const { data } = await api.post("/reviews", reviewData);
    return data;
  },

  // Get all reviews for a product
  getProductReviews: async (
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: "createdAt" | "rating" | "helpful";
      order?: "asc" | "desc";
    },
  ): Promise<ReviewsResponse> => {
    const { data } = await api.get(`/reviews/products/${productId}/reviews`, {
      params,
    });
    return data;
  },

  // Get review statistics for a product
  getProductStats: async (productId: string): Promise<ReviewStatsResponse> => {
    const { data } = await api.get(`/reviews/products/${productId}/stats`);
    return data;
  },

  // Update a review
  updateReview: async (
    reviewId: string,
    reviewData: UpdateReviewData,
  ): Promise<{ success: boolean; message: string; review: Review }> => {
    const { data } = await api.put(`/reviews/${reviewId}`, reviewData);
    return data;
  },

  // Delete a review
  deleteReview: async (
    reviewId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
  },

  // Check if user can review a product
  canUserReview: async (productId: string): Promise<CanReviewResponse> => {
    const { data } = await api.get(`/reviews/can-review/${productId}`);
    return data;
  },

  // Mark review as helpful
  markHelpful: async (
    reviewId: string,
  ): Promise<{ success: boolean; helpful: number }> => {
    const { data } = await api.post(`/reviews/${reviewId}/helpful`);
    return data;
  },
};

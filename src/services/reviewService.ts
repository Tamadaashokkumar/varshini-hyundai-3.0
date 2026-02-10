import apiClient from "./apiClient";
import { AxiosError } from "axios";

export interface ReviewPayload {
  rating: number;
  review: string; // Backend expects 'review' or 'comment' (Check your model)
}

export interface ReviewPayload {
  rating: number;
  review: string; // Backend expects 'review' or 'comment' (Check your model)
}

// --- API FUNCTIONS ---

/**
 * Get all reviews for a specific product
 * @param productId - ID of the product
 * @param page - Page number (optional)
 */
export const getProductReviews = async (
  productId: string,
  page = 1,
): Promise<any> => {
  try {
    const response = await apiClient.get(`/products/${productId}/reviews`, {
      params: {
        page,
        limit: 10, // Pagination limit
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw axiosError.response?.data?.message || "Error fetching reviews";
  }
};

/**
 * Create a new review
 * @param productId - ID of the product
 * @param reviewData - FormData (for images) or JSON object
 */
export const createProductReview = async (
  productId: string,
  reviewData: FormData | ReviewPayload,
): Promise<any> => {
  try {
    // ✅ FIX: Don't set Content-Type manually for FormData.
    // Axios detects FormData and sets the correct boundary automatically.
    const response = await apiClient.post(
      `/products/${productId}/reviews`,
      reviewData,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw axiosError.response?.data?.message || "Error submitting review";
  }
};

/**
 * Update an existing review
 * @param reviewId - ID of the review to update
 * @param reviewData - Updated data
 */
export const updateProductReview = async (
  reviewId: string,
  reviewData: ReviewPayload,
): Promise<any> => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw axiosError.response?.data?.message || "Error updating review";
  }
};

/**
 * Delete a review
 * @param reviewId - ID of the review
 */
export const deleteProductReview = async (reviewId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw axiosError.response?.data?.message || "Error deleting review";
  }
};

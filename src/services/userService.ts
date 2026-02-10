import apiClient from "./apiClient";
import { AxiosError } from "axios";

// --- TYPES (Data Structures) ---
export interface GarageVehicle {
  _id?: string;
  model: string;
  year: string | number;
  variant: string; // ✅ New Field
  fuelType: string; // ✅ New Field
  isPrimary?: boolean;
}

// --- API FUNCTIONS ---

/**
 * Get current user's garage
 */
export const getMyGarage = async (): Promise<GarageVehicle[]> => {
  try {
    const { data } = await apiClient.get("/users/garage");
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw axiosError.response?.data?.message || "Failed to fetch garage";
  }
};

/**
 * Add a new vehicle to garage
 */
export const addToGarage = async (
  vehicleData: GarageVehicle,
): Promise<GarageVehicle[]> => {
  try {
    const { data } = await apiClient.post("/users/garage", vehicleData);
    return data; // Backend returns the updated list of vehicles
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw axiosError.response?.data?.message || "Failed to add vehicle";
  }
};

/**
 * Remove a vehicle from garage
 */
export const deleteFromGarage = async (
  vehicleId: string,
): Promise<GarageVehicle[]> => {
  try {
    const { data } = await apiClient.delete(`/users/garage/${vehicleId}`);
    return data; // Backend returns the updated list
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw axiosError.response?.data?.message || "Failed to remove vehicle";
  }
};

/**
 * Sync Local Storage Garage to Database (Call after Login)
 */
export const syncLocalGarage = async (
  localGarage: GarageVehicle[],
): Promise<any> => {
  try {
    const { data } = await apiClient.post("/users/garage/sync", {
      localGarage,
    });
    return data;
  } catch (error) {
    console.error("Sync Error:", error);
    // Sync fail అయినా పర్లేదు, సైలెంట్ గా ఉండొచ్చు లేదా ఎర్రర్ త్రో చేయొచ్చు
    return null;
  }
};

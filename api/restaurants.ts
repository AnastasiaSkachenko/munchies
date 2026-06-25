import { isOpenResponse, Restaurant } from "../types"
import { apiClient } from "./client"


export async function getRestaurants(): Promise<Restaurant[] | string> {
  try {
    const response = await apiClient.get("/restaurants");
    return response.data.restaurants
  } catch {
    return "Failed to load restaurants, please try again"
  }
}

export const getRestaurantStatus = async (id: string): Promise<isOpenResponse | string> => {
  try {
    const response = await apiClient.get<isOpenResponse>(`/open/${id}`);
    return response.data; 
  } catch {
    console.error ("Failed to fetch restaurant status")
    return "Failed to load restaurant status, please try again"
  }
};

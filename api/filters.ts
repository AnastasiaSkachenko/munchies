import { Filter, FilterMap } from "../types";
import { apiClient } from "./client"


const getFilterById = async (id: string): Promise<Filter> => {
  const response = await apiClient.get<Filter>(`/filter/${id}`);
  return response.data; 
};

export async function getFilters(ids: string[]): Promise<FilterMap | string> {
  try {
    const uniqueIds = [...new Set(ids)]
    
    const promises = uniqueIds.map(id => getFilterById(id))
    const filters = await Promise.all(promises)
    
    const filterMap: {[key: string]: Filter} = {}
    filters.forEach(filter => {
      if (filter && filter.id) {
        filterMap[filter.id] = filter
      }
    })
    
    return filterMap
  } catch (error) {
    console.error("Failed to fetch filters:", error)
    return "Failed to load filters, please try again"
  }
}
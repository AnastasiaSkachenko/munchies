import { useState, useEffect } from 'react';
import { Restaurant,FilterMap } from '../types';
import { getRestaurants } from '../api/restaurants';
import { getFilters } from '../api/filters';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<FilterMap>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
        setLoading(true);
        setError(null);

        const restaurantsRes = await getRestaurants();

        if (typeof restaurantsRes === "string"){
            setError(restaurantsRes)
            return
        }

        const filterIds = restaurantsRes.flatMap(restaurant => restaurant.filterIds);

        const filtersRes = await getFilters(filterIds);

        setRestaurants(restaurantsRes || []);
        if (typeof filtersRes === "string"){
            setError(filtersRes)
            return
        }

        setFilters(filtersRes || []);
    } catch {
        setError("Error while fetching data.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredRestaurants = selectedFilters.length === 0
    ? restaurants
    : restaurants.filter(restaurant =>
        selectedFilters.every(filterId => 
          restaurant.filterIds.includes(filterId)
        )
      );
  return {
    restaurants: filteredRestaurants,
    allRestaurants: restaurants,
    filters,
    selectedFilters,
    loading,
    error,
    toggleFilter,
    refetch: fetchData,
  };
};
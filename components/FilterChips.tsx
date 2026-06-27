import React from 'react';
import { Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Filter } from '../types';

export type FilterMap = { [key: string]: Filter };

interface FilterChipsProps {
  filters: FilterMap;
  selectedFilters: string[];
  onToggle: (id: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedFilters,
  onToggle,
}) => {
  const filterList = Object.values(filters);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="max-h-[60px]"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {filterList.map((filter) => {
        const isSelected = selectedFilters.includes(filter.id);
        const imagePath = __DEV__
        ? filter.image_url.replace(
            "https://food-delivery.umain.io",
            "http://localhost:3000"
          )
        : filter.image_url;

        return (
          <TouchableOpacity
            key={filter.id}
            className={`
              flex-row items-center pr-3 h-14 rounded-[3em] mr-2 gap-1.5 overflow-hidden
              ${isSelected ? 'bg-selected' : 'bg-[#F5F5F5]'}
            `}
            onPress={() => onToggle(filter.id)}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {filter.image_url && (
              <Image
                source={{ uri: imagePath }}
                className="aspect-square h-full w-auto rounded-l-[3em]"
                resizeMode="cover"
              />
            )}
            <Text
              className={`text-title2 px-1
                ${isSelected ? 'text-light-text' : 'text-dark-text'}
              `}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>        
        );
      })}
    </ScrollView>
  );
};
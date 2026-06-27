import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { FilterMap, Restaurant } from '../types'
import { Ionicons } from '@expo/vector-icons';

interface RestaurantCardProps {
  item: Restaurant,
  onPress: (item: Restaurant) => void,
  filters: FilterMap
}

const RestaurantCard = ({ item, onPress, filters }: RestaurantCardProps) => {
  const imagePath = __DEV__
    ? item.image_url.replace(
        "https://food-delivery.umain.io",
        "http://localhost:3000"
      )
    : item.image_url;

  return (
    <View 
      className="mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <TouchableOpacity 
        className="bg-white overflow-hidden rounded-t-2xl"
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        <View className="w-full h-48 bg-gray-200 overflow-hidden rounded-t-2xl">
          {imagePath ? (
            <Image 
              source={{ uri: imagePath }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Ionicons name="restaurant-outline" size={48} color="#999" />
            </View>
          )}
        </View>

        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-title1 text-dark-text flex-1 mr-2">
              {item.name}
            </Text>
            
            <View className="flex-row items-center px-2 py-1 rounded-full">
              <Ionicons name="star" size={12} color="#E2A364" />
              <Text className="text-footer1 text-dark-text ml-1">
                {item.rating || '-'}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap my-0.5">
            {item?.filterIds?.map((filterId, index) => (
              <React.Fragment key={filterId}>
                <Text className="text-subtitle1 text-subtitle">
                  {filters[filterId]?.name}
                </Text>
                {index !== item.filterIds.length - 1 && (
                  <Text className="text-subtitle mx-1">•</Text>
                )}
              </React.Fragment>
            ))}
          </View>

          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#C0392B" />
            <Text className="text-subtitle text-footer1 ml-1">
              {item.delivery_time_minutes || '25-35'} min
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default RestaurantCard
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { FilterMap, Restaurant } from '../types'

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
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mb-4 shadow-sm"
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="w-16 h-16 bg-gray-200 rounded-lg mr-4 overflow-hidden">
          {imagePath ? (
            <Image 
              source={{ uri: imagePath }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-300 items-center justify-center">
              <Text className="text-gray-500 text-xs">No img</Text>
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold">{item.name}</Text>
                <Text className="text-gray-700">
                  {item?.filterIds?.map((filterId, index) => (
                    <React.Fragment key={filterId}>
                      {index !== 0 && " • "}
                      {filters[filterId]?.name}
                    </React.Fragment>
                  ))}
                </Text>   
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default RestaurantCard
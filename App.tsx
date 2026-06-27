import './global.css';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, FlatList, Image, View } from 'react-native';
import { useState } from 'react';
import { Restaurant } from './types';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetailModal from './components/RestaurantDetailsModal';
import { useRestaurants } from './hooks/useRestaurants';
import { FilterChips } from './components/FilterChips';

export default function App() {
  const {
    restaurants,
    filters,
    toggleFilter,
    error,
  } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const handleRestaurantPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedRestaurant(null), 300);
  };

  if (error) return (
    <SafeAreaProvider className='pt-10'>
      <Text className='text-purple-600'>{error}</Text>
    </SafeAreaProvider>
  )

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          source={require('./assets/Logo.png')}
          className="aspect-square h-16 m-3 w-auto bg-white"
          resizeMode="contain"
        />        
        <View className="h-16">
          <FilterChips 
            filters={filters} 
            selectedFilters={selectedFilters}  
            onToggle={(id) => {
              toggleFilter(id)
              setSelectedFilters(prev => 
                prev.includes(id) 
                  ? prev.filter(filterId => filterId !== id) 
                  : [...prev, id] 
              );        
            }}
          />
        </View>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 5 }}
          renderItem={({ item }) => (
            <RestaurantCard
              item={item} 
              onPress={handleRestaurantPress}
              filters={filters}
            />
          )}
        /> 
        {selectedRestaurant && (
          <RestaurantDetailModal
            visible={modalVisible}
            restaurant={selectedRestaurant}
            onClose={handleCloseModal}
            filters={filters}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
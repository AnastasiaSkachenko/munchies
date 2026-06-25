import { StatusBar } from 'expo-status-bar';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, FlatList } from 'react-native';
import { useState } from 'react';
import { Restaurant, FilterMap } from './types';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetailModal from './components/RestaurantDetailsModal';
import { useRestaurants } from './hooks/useRestaurants';

export default function App() {
  const {
    restaurants,
    filters,
    error,
  } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


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
      <StatusBar style="auto" />
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
            <RestaurantCard
              item={item} 
              onPress={handleRestaurantPress}
              filters={filters}
            />
        )}
      /> 
      {selectedRestaurant &&
        <RestaurantDetailModal
          visible={modalVisible}
          restaurant={selectedRestaurant}
          onClose={handleCloseModal}
          filters={filters}
        />
      }
    </SafeAreaProvider>
  );
}

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant, FilterMap } from '../types';

const { height: SCREEN_HEIGHT} = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.33;

interface RestaurantDetailModalProps {
  visible: boolean,
  restaurant: Restaurant,
  filters: FilterMap
  onClose: () => void
}

const RestaurantDetailModal = ({ visible, restaurant, onClose, filters }: RestaurantDetailModalProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 10,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const openModal = async () => {
      if (visible) {
        setIsVisible(true);
        
        try {
          await Promise.all([
            new Promise(resolve => {
              Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 10,
              }).start(resolve);
            }),
            new Promise(resolve => {
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }).start(resolve);
            }),
          ]);
          console.log('Modal opened successfully');
        } catch (error) {
          console.error('Animation error:', error);
        }
        
        StatusBar.setBarStyle('dark-content');
      } else {
        closeModal();
      }
    };

    openModal();
  }, [visible]);


  const closeModal = () => {
    // Create animations first
    const slideAnimation = Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    });
    
    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });

    // Run them in parallel
    Animated.parallel([
      slideAnimation,
      fadeAnimation,
    ]).start(() => {
      setIsVisible(false);
      onClose();
      StatusBar.setBarStyle('default');
    });
  };

  const imagePath = __DEV__
    ? restaurant.image_url.replace(
        "https://food-delivery.umain.io",
        "http://localhost:3000"
      )
    : restaurant.image_url;



  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={closeModal}
    >
      <View className="flex-1 justify-end">
        {/* Background overlay */}
        <Animated.View 
          className="absolute inset-0 bg-black/50"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity 
            className="flex-1"
            activeOpacity={1}
            onPress={closeModal}
          />
        </Animated.View>

        {/* Modal content */}
        <Animated.View 
          className="absolute left-0 right-0 bg-white rounded-t-3xl overflow-hidden shadow-lg"
          style={{
            transform: [{ translateY: slideAnim }],
            height: MODAL_HEIGHT + IMAGE_HEIGHT,
            top: SCREEN_HEIGHT - MODAL_HEIGHT - IMAGE_HEIGHT,
          }}
          {...panResponder.panHandlers}
        >
          {/* Drag handle */}
          <View className="items-center pt-2.5 pb-1 absolute top-0 left-0 right-0 z-10">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Image section - 1/3 of screen */}
          <View className="relative w-full" style={{ height: IMAGE_HEIGHT }}>
            {imagePath ? (
              <Image 
                source={{ uri: imagePath }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gray-100 items-center justify-center">
                <Ionicons name="restaurant-outline" size={60} color="#ccc" />
              </View>
            )}
            
            {/* Close button */}
            <TouchableOpacity 
              className="absolute top-5 right-5 z-10"
              onPress={closeModal}
            >
              <Ionicons name="close-circle" size={32} color="black" />
            </TouchableOpacity>

            {/* Restaurant name overlay on image */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-black/30">
              <Text className="text-2xl font-bold text-white">
                {restaurant?.name || 'Restaurant'}
              </Text>
            </View>
          </View>

          {/* Content section - 50% of screen with margin */}
          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          >
            <View className="mt-2.5">
              {/* Restaurant info */}
              <View className="mb-5">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="star" size={20} color="#FFB800" />
                  <Text className="text-base font-bold ml-1 mr-2">
                    {restaurant?.rating || '4.5'} ★
                  </Text>
                </View>
        
                <Text className="text-gray-700">
                  {restaurant?.filterIds?.map((filterId, index) => (
                    <React.Fragment key={filterId}>
                      {index !== 0 && " • "}
                      {filters[filterId]?.name}
                    </React.Fragment>
                  ))}
                </Text>   

                <View className="flex-row items-center mb-2">
                  <Ionicons name="time-outline" size={18} color="#666" />
                  <Text className="text-sm text-gray-500 ml-2">
                    {restaurant?.delivery_time_minutes || '25-35 min'} • Free delivery
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <Ionicons name="location-outline" size={18} color="#666" />
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={18} color="#666" />
                </View>
              </View>


              {/* Menu or additional info */}
              <View className="mb-5">
                <Text className="text-lg font-bold mb-2.5 text-black">Popular Items</Text>
              </View>

              {/* Action buttons */}
              <View className="flex-row mt-2.5 mb-2.5">
                <TouchableOpacity className="flex-1 bg-red-500 rounded-xl py-4 items-center mr-3">
                  <Text className="text-white text-base font-bold">Order Now</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-14 h-14 rounded-xl bg-gray-100 items-center justify-center">
                  <Ionicons name="heart-outline" size={24} color="#FF4B4B" />
                </TouchableOpacity>
              </View>

              {/* Bottom spacing */}
              <View className="h-5" />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default RestaurantDetailModal;
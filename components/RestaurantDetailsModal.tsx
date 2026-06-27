import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant, FilterMap } from '../types';
import { getRestaurantStatus } from '../api/restaurants';

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

  useEffect(() => {
    const getOpenStatus = async () => {
      try {
        const response = await getRestaurantStatus(restaurant.id)
        if (typeof response === "string") {
          restaurant.isOpen = undefined;
          return
        }
        restaurant.isOpen = response.is_currently_open
      } catch {
        console.log("Failed to fetch restaurants status")
      }
    }

    getOpenStatus()
  },[])



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
      statusBarTranslucent={true}
    >
      <StatusBar hidden />
      <View className="flex-1 justify-end">
        <Animated.View 
          className="absolute inset-0"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity 
            className="flex-1"
            activeOpacity={1}
            onPress={closeModal}
          />
        </Animated.View>

        <Animated.View 
          className="absolute left-0 right-0 bg-white rounded-t-3xl"
          style={{
            transform: [{ translateY: slideAnim }],
            height: MODAL_HEIGHT + IMAGE_HEIGHT,
            top: SCREEN_HEIGHT - MODAL_HEIGHT - IMAGE_HEIGHT,
          }}
          {...panResponder.panHandlers}
        >
          <View className="items-center pt-2.5 pb-1 absolute top-0 left-0 right-0 z-20">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>
          <View className="relative w-full" style={{ height: IMAGE_HEIGHT }}>
            <Image 
              source={{ uri: imagePath }}
              className="w-full h-full"
              resizeMode="cover"
            />
            
            <TouchableOpacity 
              className="absolute top-12 left-5 z-10 p-2"
              onPress={closeModal}
            >
              <Ionicons name="chevron-down" size={24} color="#1F2B2E" />
            </TouchableOpacity>
          </View>

          <View 
            className="absolute left-5 right-5 bg-white rounded-3xl p-5 flex gap-2"
            style={{
              top: IMAGE_HEIGHT - 30,
              zIndex: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text className="text-headline1 text-dark-text">
              {restaurant?.name || 'Restaurant'}
            </Text>

            <Text className="text-subtitle mt-1">
              {restaurant?.filterIds?.map((filterId, index) => (
                <React.Fragment key={filterId}>
                  {index !== 0 && " • "}
                  {filters[filterId]?.name}
                </React.Fragment>
              ))}
            </Text>   

            <Text className={`text-title2 mt-2 ${restaurant.isOpen ? "text-positive" : "text-negative"}`}>
              {restaurant.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default RestaurantDetailModal;
import axios from 'axios';

// FIX: Correct API base URL
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Your proxy server
  : 'https://food-delivery.umain.io/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Critical for React Native - don't use withCredentials
  withCredentials: false,
});

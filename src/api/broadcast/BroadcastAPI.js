import axios from 'axios';

// Fetch broadcasts
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchBroadcasts = async () => {
  try {
    const response = await axios.get(API_BASE_URL+'/broadcasts?page=0&size=5');
    return response.data.data.content; 
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    throw error; 
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_BASE_URL+'/catagory');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; 
  }
};

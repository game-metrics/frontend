import axios from 'axios';

// Fetch broadcasts
export const fetchBroadcasts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/broadcasts?page=0&size=5');
    return response.data.data.content; 
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    throw error; 
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8080/catagory');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; 
  }
};

// src/api/VideoAPI.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchVideos = async (page = 0, size = 4) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?page=${page}&size=${size}`);
    const data = response.data.data;
    console.log(data)
    // Optional: check structure
    return {
      content: data?.content || [],
      totalPages: data?.totalPages || 0,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return {
      content: [],
      totalPages: 0,
    };
  }
};

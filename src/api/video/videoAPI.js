import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchVideos = async (page = 0, size = 4) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos?page=${page}&size=${size}`);
    const data = response.data.data;
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

// video 하나 가져오기 기능.

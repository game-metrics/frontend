import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Update with your backend's base URL

/**
 * Function to send sign-up data to the backend.
 * @param {Object} userDetails - The user's sign-up details (name, email, password).
 * @returns {Promise} - Axios response Promise.
 */
export const signUp = async (userDetails) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const signIn = async (userDetails) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, userDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
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

// OAuth Kakao
export const loginWithKakao = async (code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login/kakao`, { code });
    return response.data.data; // 서버에서 반환된 이메일
  } catch (error) {
    console.error('Error during Kakao login:', error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

// OAuth Google
export const loginWithGoogle = async (code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login/google`, { code });
    return response; // 서버에서 반환된 이메일
  } catch (error) {
    console.error('Error during Login login:', error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};

import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const sendBroadcastData = async (title, url, categoryId) => {
  const token = localStorage.getItem("auth"); // 로컬스토리지에서 'auth' 가져오기
  if (!token) throw new Error("No auth token");

  const broadcastData = {
    title: title,
    thumbNailUrl: url,
    categoryId: categoryId,  // Fixed typo from 'catagoryId' to 'categoryId'
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/broadcasts`, broadcastData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Fixed header syntax
      },
    });

    console.log("Success:", response.data);
  } catch (error) {
    console.error("Request failed", error);
  }
};

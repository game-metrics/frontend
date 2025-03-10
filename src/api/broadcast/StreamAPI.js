import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const sendBroadcastData = async (title, url, categoryId) => {
  const token = localStorage.getItem("auth"); // Get auth token
  if (!token) throw new Error("No auth token");

  const broadcastData = {
    title,
    thumbNailUrl: url,
    categoryId,
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/broadcasts`, broadcastData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    console.log("Success:", response.data);
    return response.data; // ✅ Returning response data
  } catch (error) {
    console.error("Request failed", error);
    throw error; // ✅ Propagate error to be handled by caller
  }
};


import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_WS = process.env.REACT_APP_BACKEND_WS;

// 방송 목록 가져오기
export const fetchBroadcasts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/broadcasts?page=0&size=5`);
    return response.data.data.content; 
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    throw error; 
  }
};

// 카테고리 목록 가져오기
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; 
  }
};

// WebSocket 채팅 연결
export const initWebSocket = (roomId, nickname, setMessages) => {
  const socket = new WebSocket(`${API_BASE_WS}/ws`);

  socket.onopen = () => {
    const joinMessage = {
      type: 'JOIN',
      roomId,
      sender: nickname,
      message: `${nickname} 입장`,
    };
    socket.send(JSON.stringify(joinMessage));
  };

  socket.onmessage = (event) => {
    const newMessage = JSON.parse(event.data);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
  };

  return socket;
};


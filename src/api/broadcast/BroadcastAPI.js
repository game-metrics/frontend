import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_WS = process.env.REACT_APP_BACKEND_WS;

// Fetch broadcasts
export const fetchBroadcasts = async (page, size = 4) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/broadcasts?page=${page}&size=${size}`);
    return response.data.data; // 여기서 content, totalPages 등이 포함됨
  } catch (error) {
    console.error("Error fetching broadcasts:", error);
    throw error;
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_BASE_URL+'/category');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; 
  }
};


// connection websock chat
export const initWebSocket = (roomId, nickname, setMessages) => {
  const socket = new WebSocket(API_BASE_WS+'/ws');

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


// connection websock chat
export const confirmBroadcast = (roomId) => {
  try {
    fetch(API_BASE_URL+`/broadcasts/confirm?broadcastId=${roomId}`);
    console.log('✅ 방송 확인 요청 완료');
  } catch (err) {
    console.error('❌ 방송 확인 요청 실패:', err);
  }
};
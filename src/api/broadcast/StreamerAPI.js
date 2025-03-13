import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_WS = process.env.REACT_APP_BACKEND_WS;

export const initWebSocket = (roomId, nickname, setMessages) => {
    const socket = new WebSocket(API_BASE_WS+`/chat?roomId=${roomId}&nickname=${nickname}`);
  
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };
  
    socket.onclose = () => console.log('WebSocket closed');
  
    return socket;
  };
  
  export const sendMessage = (ws, roomId, nickname, message, setInputMessage) => {
    if (ws && message.trim()) {
      ws.send(JSON.stringify({ type: 'TALK', roomId, sender: nickname, message }));
      setInputMessage('');
    }
  };
  
  // 🔹 방송 종료 API 
export const endBroadcast = async (roomId, token, navigate) => {
    if (!token) {
      alert('인증 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/');
      return;
    }
  
    navigate('/');
  
    try {
      await axios.patch(
        `${API_BASE_URL}/streamers`, // 🔹 API 엔드포인트 변경
        { streamId: Number(roomId) },
        { headers: { Authorization: token, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('방송 종료 오류:', error);
    }
  };
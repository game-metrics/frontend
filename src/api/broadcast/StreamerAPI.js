import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_WS = process.env.REACT_APP_BACKEND_WS;

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
  
  export const sendMessage = (ws, roomId, nickname, message, setInputMessage) => {
    if (ws && message.trim()) {
      ws.send(JSON.stringify({ type: 'TALK', roomId, sender: nickname, message }));
      setInputMessage('');
    }
  };

// 방송 시작 PATCH 요청
export const startBroadcast = async (roomId, token) => {
  try {
    const response = await fetch(API_BASE_URL+'/broadcasts/on', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ broadcastId: roomId }),
    });

    if (!response.ok) throw new Error('방송 시작 PATCH 실패');

    const data = await response.json();
    console.log('✅ 방송 상태 업데이트 성공:', data);
    return data;
  } catch (error) {
    console.error('⚠️ 방송 상태 업데이트 실패:', error);
    throw error;
  }
};

// 방송 종료 API
export const endBroadcast = async (roomId, token, navigate) => {
  try {
    const response = await fetch(API_BASE_URL+`/broadcasts/off`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ broadcastId: roomId }),
    });

    if (!response.ok) throw new Error('방송 종료 PATCH 실패');

    const data = await response.json();
    console.log('🛑 방송 종료 성공:', data);
    alert('방송이 종료되었습니다.');
    navigate('/');
  } catch (err) {
    console.error('🛑 방송 종료 실패:', err);
    alert('방송 종료 중 문제가 발생했습니다.');
  }
};
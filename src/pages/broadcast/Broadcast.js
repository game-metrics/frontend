import { initWebSocket } from '../../api/broadcast/BroadcastAPI';
import { useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import './css/Broadcast.css';

const Broadcast = () => {
  const [params] = useSearchParams();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messageEndRef = useRef(null);

  const roomId = params.get('id');
  const nickname = localStorage.getItem('nickname') || '익명';

  useEffect(() => {
    const socket = initWebSocket(roomId, nickname, setMessages);
    setWs(socket);

    console.log(roomId);

    return () => {
      socket.close();
    };
  }, [roomId, nickname]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (ws && inputMessage.trim() !== '') {
      const messageData = {
        type: 'TALK',
        roomId,
        sender: nickname,
        message: inputMessage,
      };
      console.log(messageData);
      ws.send(JSON.stringify(messageData));
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className='broadcast'>
      {/* 왼쪽: 비디오 */}
      <div className='video_container'>
        <video>
          <source src="your-video.mp4" type="video/mp4" />
          브라우저가 비디오를 지원하지 않습니다.
        </video>
      </div>

      {/* 오른쪽: 채팅 */}
      <div className='chat_container'>
        <div>💬 채팅</div>
        <div className='chat_messages'>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div>
                <span>
                  <strong>{msg.sender}</strong>: {msg.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className='chat_input'>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;

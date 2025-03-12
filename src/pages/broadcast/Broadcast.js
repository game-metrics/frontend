import { initWebSocket } from '../../api/broadcast/BroadcastAPI';
import { useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

import './css/Broadcast.css';

const Broadcast = () => {
  const [params] = useSearchParams();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const videoRef = useRef(null);
  const messageEndRef = useRef(null);

  const roomId = params.get('id');
  const nickname = localStorage.getItem('nickname') || '익명';
  const streamUrl = "http://52.78.97.122/hls/222.m3u8"; // HLS 스트림 URL

  // 🔹 WebSocket 연결 설정
  useEffect(() => {
    if (!roomId || !nickname) return;

    const socket = initWebSocket(roomId, nickname, setMessages);
    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [roomId, nickname]);

  // 🔹 채팅 자동 스크롤
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 🔹 HLS.js로 비디오 스트리밍 설정
  useEffect(() => {
    let hls;

    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play();
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  // 🔹 메시지 전송 함수
  const sendMessage = () => {
    if (ws && inputMessage.trim()) {
      ws.send(JSON.stringify({
        type: 'TALK',
        roomId,
        sender: nickname,
        message: inputMessage,
      }));
      setInputMessage('');
    }
  };

  // 🔹 엔터 키 입력 감지
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='broadcast'>
      {/* 왼쪽: 비디오 */}
      <div className='video_container'>
        <video ref={videoRef} controls autoPlay width="100%" height="100%" />
      </div>

      {/* 오른쪽: 채팅 */}
      <div className='chat_container'>
        <div>💬 채팅</div>
        <div className='chat_messages'>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.sender}</strong>: {msg.message}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className='chat_input'>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;

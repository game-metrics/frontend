import { initWebSocket } from '../../api/broadcast/BroadcastAPI';
import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import axios from 'axios';

import './css/Broadcast.css';

const StreamerPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const videoRef = useRef(null);
  const messageEndRef = useRef(null);

  const hlsurl =  process.env.REACT_APP_HLS;
  const rtmpurl =  process.env.REACT_APP_RTMP;

  const roomId = params.get('id');
  const nickname = localStorage.getItem('nickname') || '익명';
  const token = localStorage.getItem('auth'); // 🔹 인증 토큰 가져오기
  const streamUrl = hlsurl+`/${roomId}.m3u8`;
  const rtmpUrl = rtmpurl;
  
  // 🔹 🔥 토큰 없으면 로그인 페이지로 이동
  useEffect(() => {
    if (!token) {
      alert('로그인 해주십쇼');
      navigate('/'); // 홈으로 이동
    }
  }, [token, navigate]);

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
      ws.send(
        JSON.stringify({
          type: 'TALK',
          roomId,
          sender: nickname,
          message: inputMessage,
        })
      );
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

  // 🔹 방송 종료 함수 (홈으로 즉시 이동)
  const endBroadcast = async () => {
    if (!token) {
      alert('인증 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/'); // 🔹 바로 홈으로 이동
      return;
    }

    // 🔹 먼저 홈으로 이동
    navigate('/');

    try {
      await axios.patch(
        'http://localhost:8080/broadcasts',
        { broadcastId: Number(roomId) },
        {
          headers: {
            Authorization: token, // 🔹 Bearer 제거
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('방송 종료 오류:', error);
    }
  };

  return (
    <div className='broadcast'>
      {/* 비디오 & OBS 설정 포함 */}
      <div className='stream_section'>
        {/* 🔹 영상 크기 조절 (width 640px, height 360px) */}
        <video
          ref={videoRef}
          controls
          autoPlay
          width='640'
          height='360'
          style={{ borderRadius: '8px', border: '1px solid #ddd' }}
        />

        {/* 🔹 OBS 방송 설정 정보 */}
        <div className='obs_info' style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>🎥 OBS 방송 설정</h3>
          <p>
            <strong>📡 방송 URL:</strong> {rtmpUrl}
          </p>
          <p>
            <strong>🔑 스트림 키:</strong> {roomId}
          </p>
          <a
            href='https://obsproject.com/download'
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            📥 OBS 다운로드 링크
          </a>
          <p>
            <a
              href='https://support.obsproject.com'
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: '#28a745', textDecoration: 'underline' }}
            >
              📘 OBS 사용법 가이드
            </a>
          </p>

          {/* 🛑 방송 종료 버튼 추가 */}
          <button onClick={endBroadcast} className='end_broadcast_btn' style={{ marginTop: '15px' }}>
            🛑 방송 종료
          </button>
        </div>
      </div>

      {/* 채팅 창 */}
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
            type='text'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='메시지를 입력하세요...'
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default StreamerPage;

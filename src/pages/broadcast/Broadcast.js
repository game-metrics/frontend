import { initWebSocket,confirmBroadcast } from '../../api/broadcast/BroadcastAPI';
import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

import './css/Broadcast.css';

const Broadcast = () => {
  const [params] = useSearchParams();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [streamFailed, setStreamFailed] = useState(false);

  const videoRef = useRef(null);
  const messageEndRef = useRef(null);

  const hlsurl = process.env.REACT_APP_HLS;
  const roomId = params.get('id');
  const nickname = localStorage.getItem('nickname') || '익명';
  const streamUrl = `${hlsurl}/${roomId}.m3u8`;
  const navi = useNavigate();

  // 🔹 WebSocket 연결 설정
  useEffect(() => {
    if (!roomId || !nickname) return;

    const socket = initWebSocket(roomId, nickname, setMessages);
    setWs(socket);

    return () => {
      if (socket) socket.close();
    };
  }, [roomId, nickname]);

  // 🔹 채팅 자동 스크롤
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 🔹 HLS.js로 비디오 스트리밍 설정 (5회까지 시도)
  useEffect(() => {
    let hls;

    const tryLoadStream = async (attempt = 1) => {

      if (attempt > 3) {
        // 실패 처리
        setStreamFailed(true);
        setMessages(prev => [
          ...prev,
          { sender: '시스템', message: '⚠️ 방송 송출이 종료되었습니다.' }
        ]);
        
        // 🔸 방송 종료 확인 신호 전송
        await confirmBroadcast(roomId);
        alert("Broadcast has been finished");
        navi("/");
        return ;
      }

      if (videoRef.current) {
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              hls.destroy();
              setTimeout(() => tryLoadStream(attempt + 1), 2000); // 2초 후 재시도
              setRetryCount(attempt);
            }
          });

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current.play().catch(err => {
              console.error(`자동 재생 실패:${retryCount} out of 4`, err);
            });
          });

        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = streamUrl;
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current.play().catch(err => {
              console.error('자동 재생 실패:', err);
            });
          });
        }
      }
    };

    tryLoadStream();

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl,retryCount, roomId, navi]);

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
        {streamFailed && (
          <div className="stream_error">
            ❌ Stream connection has ended.
          </div>
        )}
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

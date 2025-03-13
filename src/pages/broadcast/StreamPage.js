import { initWebSocket, endBroadcast, startBroadcast } from '../../api/broadcast/StreamerAPI';
import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

import './css/Broadcast.css';

const StreamerPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const videoRef = useRef(null);
  const messageEndRef = useRef(null);
  const [isBroadcastStarted, setIsBroadcastStarted] = useState(false); // ✅ 중복 방지용

  const hlsurl = process.env.REACT_APP_HLS;
  const rtmpurl = process.env.REACT_APP_RTMP;

  const roomId = params.get('id');
  const nickname = localStorage.getItem('nickname') || '익명';
  const token = localStorage.getItem('auth');
  const streamUrl = `${hlsurl}/${roomId}.m3u8`;
  const rtmpUrl = rtmpurl;

  // 토큰 없으면 로그인 이동
  useEffect(() => {
    if (!token) {
      alert('로그인 해주십쇼');
      navigate('/');
    }
  }, [token, navigate]);

  // WebSocket 연결
  useEffect(() => {
    if (!roomId || !nickname) return;

    const socket = initWebSocket(roomId, nickname, setMessages);
    setWs(socket);

    return () => {
      if (socket) socket.close();
    };
  }, [roomId, nickname]);

  // 채팅 자동 스크롤
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // HLS 스트리밍 설정 및 상태 업데이트
  useEffect(() => {
    let hls;
    let retryTimeout;

    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // 방송 시작 PATCH 요청 (한 번만)
          // HLS 준비 완료 시 방송 시작 PATCH 요청
          if (!isBroadcastStarted) {
            startBroadcast(roomId, token)
              .then(() => setIsBroadcastStarted(true))
              .catch((err) => console.error('방송 시작 실패', err));
          }
        });

        // HLS 에러 감지 및 재시도
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('🔴 HLS 오류 감지:', data);

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn('📡 네트워크 오류! 5초 후 다시 시도합니다.');
                retryTimeout = setTimeout(() => {
                  hls.loadSource(streamUrl);
                  hls.attachMedia(videoRef.current);
                }, 5000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn('🎞 미디어 오류 - 복구 시도');
                hls.recoverMediaError();
                break;
              default:
                console.warn('⚠️ 치명적 오류 - HLS 플레이어 재시작');
                retryTimeout = setTimeout(() => {
                  hls.destroy();
                  hls = new Hls();
                  hls.loadSource(streamUrl);
                  hls.attachMedia(videoRef.current);
                }, 5000);
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          // 자동 재생 방지, 사용자가 클릭 후 play() 호출
        });
      }
    }

    return () => {
      if (hls) hls.destroy();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [streamUrl, token, roomId, isBroadcastStarted]);

  // 비디오 클릭 시 재생하도록 수정
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('자동 재생 실패:', err);
        alert('비디오 자동 재생에 실패했습니다. 다시 시도해 주세요.');
      });
    }
  };

  // 메시지 전송 함수
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

  // 엔터 키 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='broadcast'>
      {/* 스트리밍 영역 */}
      <div className='stream_section'>
        <video
          ref={videoRef}
          controls
          width='640'
          height='360'
          style={{ borderRadius: '8px', border: '1px solid #ddd' }}
          onClick={handlePlayClick} // 클릭 시 비디오 재생
        />

        <div className='obs_info' style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>🎥 OBS 방송 설정</h3>
          <p><strong>📡 방송 URL:</strong> {rtmpUrl}</p>
          <p><strong>🔑 스트림 키:</strong> {roomId}</p>
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
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: '#28a745' }}
            >
              📘 OBS 사용법 가이드
              <br />
              1. OBS 설치 및 열기<br />
              2. 파일 - 설정 - 방송 <br />
              3. 서비스: 사용자 지정 선택<br />
              4. 서버 칸에 방송 URL, 스트림 키 칸에 스트림 키 입력<br />
              5. 방송 시작 (20초 정도 후 HLS 생방 시작됨)
            </a>
          </p>

          <button
            onClick={() => endBroadcast(roomId, token, navigate)}
            className='end_broadcast_btn'
            style={{ marginTop: '15px' }}
          >
            🛑 방송 종료
          </button>
        </div>
      </div>

      {/* 채팅창 */}
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

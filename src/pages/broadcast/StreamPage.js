import { initWebSocket, endBroadcast, startBroadcast } from '../../api/broadcast/StreamerAPI';
import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

import './css/Broadcast.css';
import { red } from '@mui/material/colors';

const StreamerPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const videoRef = useRef(null);
  const messageEndRef = useRef(null);
  const [isBroadcastStarted, setIsBroadcastStarted] = useState(false); // ✅ To prevent duplicate calls

  const hlsurl = process.env.REACT_APP_HLS;
  const rtmpurl = process.env.REACT_APP_RTMP;

  const roomId = params.get('id');
  const nickname = localStorage.getItem('nickname') || 'Anonymous';
  const token = localStorage.getItem('auth');
  const streamUrl = `${hlsurl}/${roomId}.m3u8`;
  const rtmpUrl = rtmpurl;

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      alert('Please log in');
      navigate('/');
    }
  }, [token, navigate]);

  // WebSocket connection
  useEffect(() => {
    if (!roomId || !nickname) return;

    const socket = initWebSocket(roomId, nickname, setMessages);
    setWs(socket);

    return () => {
      if (socket) socket.close();
    };
  }, [roomId, nickname]);

  // Auto-scroll chat
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // HLS setup and broadcast state update
  useEffect(() => {
    let hls;
    let retryTimeout;

    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // PATCH startBroadcast only once when HLS is ready
          if (!isBroadcastStarted) {
            startBroadcast(roomId, token)
              .then(() => setIsBroadcastStarted(true))
              .catch((err) => console.error('Failed to start broadcast', err));
          }
        });

        // Handle HLS errors and retry logic
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('🔴 HLS error detected:', data);

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn('📡 Network error! Retrying in 5 seconds.');
                retryTimeout = setTimeout(() => {
                  hls.loadSource(streamUrl);
                  hls.attachMedia(videoRef.current);
                }, 5000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn('🎞 Media error - trying to recover');
                hls.recoverMediaError();
                break;
              default:
                console.warn('⚠️ Fatal error - restarting HLS player');
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
          // Prevent autoplay — wait for user interaction to call play()
        });
      }
    }

    return () => {
      if (hls) hls.destroy();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [streamUrl, token, roomId, isBroadcastStarted]);

  // Play video on click
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('Autoplay failed:', err);
        alert('Failed to auto-play the video. Please try again.');
      });
    }
  };

  // Send chat message
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

  // Handle enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='broadcast'>
      {/* Stream Section */}
      <div className='stream_section'>
        <video
          ref={videoRef}
          controls
          width='640'
          height='360'
          style={{ borderRadius: '8px', border: '1px solid #ddd' }}
          onClick={handlePlayClick} // Play video on click
        />

        <div className='obs_info' style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>🎥 OBS Broadcast Settings</h3>
          <p><strong>📡 Stream URL:</strong> {rtmpUrl}</p>
          <p><strong>🔑 Stream Key:</strong> {roomId}</p>
          <a
            href='https://obsproject.com/download'
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            📥 Download OBS
          </a>
          <p>
            <p
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: '#28a745' }}
            >
              📘 OBS User Guide
              <br />
              1. Install and open OBS<br />
              2. Go to File - Settings - Stream<br />
              3. Service: Choose Custom<br />
              4. Server = Stream URL, Stream Key = Stream Key above<br />
              5. Start Streaming (HLS live starts after ~20 seconds)
            </p>
          </p>

          <button
            onClick={() => endBroadcast(roomId, token, navigate)}
            className='end_broadcast_btn'
            style={{ marginTop: '15px' }}
          >
            🛑 End Broadcast
          </button>
          <h2 style={{ color: red }}>Stream Auto Finishes if the connection is closed</h2>
        </div>
      </div>

      {/* Chat Box */}
      <div className='chat_container'>
        <div>💬 Chat</div>
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
            placeholder='Type a message...'
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default StreamerPage;

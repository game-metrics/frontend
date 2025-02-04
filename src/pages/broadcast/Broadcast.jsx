import React, { useEffect, useState, useCallback } from "react";
import './css/Broadcast.css'

function BroadCast() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ws = new WebSocket("ws://localhost:8080/ws/chat");

    ws.onopen = () => {
      console.log("Connected to WebSocket");

      const joinMessage = {
        type: "JOIN", // ChatMessageDto.MessageType.JOIN 근대 바
        roomId: 1,    // 채팅방 ID
        sender: "User1", // Todo : 토큰이나 닉네임 같은걸로
        message: "User1 joined the chat",
      };
      ws.send(JSON.stringify(joinMessage));
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, receivedMessage]); // 최신 상태 반영
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket. Reconnecting...");
      setTimeout(() => setSocket(new WebSocket("ws://localhost:8080/ws/chat")), 3000); // 3초 후 재연결 시도
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (socket && message.trim() !== "") {
      const chatMessage = {
        type: "TALK",  // ChatMessageDto.MessageType.TALK
        roomId: 1,     // 채팅방 ID
        sender: "User1",
        message: message,
      };
      socket.send(JSON.stringify(chatMessage));
      setMessage(""); // 입력창 초기화
    }
  }, [socket, message]);

  return (
    <div className="container">
      {/* 생방송 동영상 */}
      <div className="videoContainer">
        <h2 className="title">방송</h2>
        <video
          controls
          autoPlay
          muted
          className="video"
        >
          <source src="your-live-stream-url.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>

      {/* 채팅 박스 */}
      <div className="chatBox">
        <h2 className="title">채팅</h2>
        <div className="messageContainer">
          {messages.map((msg, index) => (
            <p key={index} className="message">
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          ))}
        </div>
        <div className="inputContainer">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="input"
          />
          <button onClick={sendMessage} className="button">전송</button>
        </div>
      </div>
    </div>
  );
}

export default BroadCast;

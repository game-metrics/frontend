import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터 가져오기
import "./css/Broadcast.css";

function BroadCast() {
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState(""); 
  const backendurl = process.env.REACT_APP_BACKEND_WS; // .env 파일에서 WebSocket 주소 가져오기

  useEffect(() => {
    console.log("Backend URL:", backendurl); // backendurl 값 확인
    if (!backendurl) {
      console.error("WebSocket URL이 설정되지 않았습니다.");
      return;
    }

    // localStorage에서 nickname 가져오기
    const storedNickname = localStorage.getItem("nickname");
    setNickname(storedNickname || "익명"); // 없으면 기본값 '익명'

    let ws = new WebSocket(`${backendurl}/ws/chat`);

    ws.onopen = () => {
      console.log("WebSocket 연결됨");

      const joinMessage = {
        type: "JOIN",
        roomId: roomId,
        sender: storedNickname || "익명", // 닉네임 없으면 기본값 '익명'
        message: `${storedNickname || "익명"} 님이 입장하셨습니다.`,
      };

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(joinMessage));
      } else {
        console.warn("WebSocket이 아직 OPEN 상태가 아닙니다.");
      }
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, receivedMessage]);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료됨. 3초 후 재연결 시도...");
      setTimeout(() => setSocket(new WebSocket(`${backendurl}/ws/chat`)), 3000);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId, backendurl]); // backendurl도 종속성에 추가

  const sendMessage = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN && message.trim() !== "") {
      const chatMessage = {
        type: "TALK",
        roomId: roomId,
        sender: nickname,
        message: message,
      };

      socket.send(JSON.stringify(chatMessage));
      setMessage(""); 
    } else {
      console.warn("WebSocket이 아직 OPEN 상태가 아닙니다.");
    }
  }, [socket, message, roomId, nickname]);

  return (
    <div className="container">
      <div className="videoContainer">
        <h2 className="title">방송</h2>
        <video controls autoPlay muted className="video">
          <source src="your-live-stream-url.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>

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

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터 가져오기
import "./css/Broadcast.css";

function BroadCast() {
  const { roomId } = useParams(); // URL에서 roomId 가져오기
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState(""); // 닉네임 상태

  // 쿠키에서 특정 이름의 값을 가져오는 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const userNickname = getCookie("nickname"); // 닉네임 쿠키 가져오기
    setNickname(userNickname || "익명"); // 닉네임 없으면 기본값 설정

    let ws = new WebSocket("ws://localhost:8080/ws/chat");

    ws.onopen = () => {
      console.log("WebSocket 연결됨");

      const joinMessage = {
        type: "JOIN",
        roomId: roomId, // URL에서 가져온 채팅방 ID
        sender: userNickname || "익명",
        message: `${userNickname || "익명"} 님이 입장하셨습니다.`,
      };
      ws.send(JSON.stringify(joinMessage));
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, receivedMessage]);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료됨. 재연결 시도 중...");
      setTimeout(() => setSocket(new WebSocket("ws://localhost:8080/ws/chat")), 3000);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId]); // roomId가 변경될 때마다 실행

  const sendMessage = useCallback(() => {
    if (socket && message.trim() !== "") {
      const chatMessage = {
        type: "TALK",
        roomId: roomId,
        sender: nickname, // 쿠키에서 가져온 닉네임 사용
        message: message,
      };
      socket.send(JSON.stringify(chatMessage));
      setMessage(""); // 입력창 초기화
    }
  }, [socket, message, roomId, nickname]);

  return (
    <div className="container">
      {/* 생방송 동영상 */}
      <div className="videoContainer">
        <h2 className="title">방송</h2>
        <video controls autoPlay muted className="video">
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

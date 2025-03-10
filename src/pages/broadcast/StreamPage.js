// import React, { useEffect, useRef, useState } from 'react';

// const ChatWebSocket = ({ roomId, username }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const ws = useRef(null);

//   useEffect(() => {
//     // WebSocket 연결
//     ws.current = new WebSocket('ws://localhost:8080/ws'); // 포트와 주소는 서버 환경에 맞게 변경

//     // 연결이 열렸을 때
//     ws.current.onopen = () => {
//       console.log('✅ WebSocket 연결됨');

//       // JOIN 메시지 전송
//       const joinMessage = {
//         type: 'JOIN',
//         roomId: roomId,
//         sender: username,
//         message: `${username} 님이 입장하셨습니다.`,
//       };
//       ws.current.send(JSON.stringify(joinMessage));
//     };

//     // 서버로부터 메시지를 받았을 때
//     ws.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log('📩 수신된 메시지:', data);
//       setMessages((prev) => [...prev, data]);
//     };

//     // 연결 종료 시
//     ws.current.onclose = () => {
//       console.log('❌ WebSocket 연결 종료');
//     };

//     return () => {
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, [roomId, username]);

//   const sendMessage = () => {
//     if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//       const message = {
//         type: 'TALK',
//         roomId: roomId,
//         sender: username,
//         message: input,
//       };
//       ws.current.send(JSON.stringify(message));
//       setInput('');
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-2">채팅방 #{roomId}</h2>
//       <div className="h-60 overflow-y-auto border mb-2 p-2 bg-gray-100 rounded">
//         {messages.map((msg, idx) => (
//           <div key={idx} className="mb-1">
//             <strong>{msg.sender}:</strong> {msg.message}
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           className="flex-grow border p-1 rounded"
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button className="bg-blue-500 text-white px-4 rounded" onClick={sendMessage}>
//           전송
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWebSocket;

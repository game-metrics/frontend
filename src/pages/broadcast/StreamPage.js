// import React, { useEffect, useRef, useState } from "react";
// import './css/Broadcast.css'

// function Stream() {
//   const [stream, setStream] = useState(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const getUserMedia = async () => {
//         try {
//           const userStream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true,
//           });
      
//           setStream(userStream);
//           if (videoRef.current) {
//             videoRef.current.srcObject = userStream;
//           }
//         } catch (error) {
//           if (error.name === "NotFoundError") {
//             alert("No camera or microphone found.");
//           } else {
//             alert("Error accessing media devices", error);
//           }
//         }
//       };
      

//     getUserMedia();

//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, []);

//   return (
//     <div className="container">
//       <div className="chatBox">
//         <h2 className="title">채팅</h2>
//         {/* Chat content goes here */}
//       </div>

//       <div className="videoContainer">
//         <h2 className="title">생방송</h2>
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="video"
//         />
//       </div>
//     </div>
//   );
// }

// export default Stream;

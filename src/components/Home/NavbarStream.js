import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function NavbarStream({ liveStream }) {
  const videoRef = useRef();

  useEffect(() => {
    if (liveStream && videoRef.current) {
      const video = videoRef.current;
      const hls = new Hls();
      const videoSrc = `${process.env.REACT_APP_HLS}/${liveStream.id}.m3u8`;

      if (Hls.isSupported()) {
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari처럼 기본 HLS 지원 브라우저
        video.src = videoSrc;
      }

      return () => {
        hls.destroy();
      };
    }
  }, [liveStream]);

  if (!liveStream) {
    return <div className="navbar-stream-nostream">There is no Live Stream Currently</div>;
  }

  return (
    <div className="navbar-stream">
      <div className="live-video">
        <h3>🎥 Live Stream </h3>
        <video
          ref={videoRef}
          controls
          autoPlay
          muted
          style={{ width: '40%', height: 'auto' }}
        />
      </div>
    </div>
  );
}

export default NavbarStream;

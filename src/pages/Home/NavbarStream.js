import React, { useState, useEffect } from 'react';
import { fetchBroadcasts } from '../../api/broadcast/BroadcastAPI';

import "./css/Home.css";

function NavbarStream() {
  const [liveStream, setLiveStream] = useState(null);

  useEffect(() => {
    const getLiveStream = async () => {
      try {
        const broadcasts = await fetchBroadcasts();
        const live = broadcasts.find((stream) => stream.isLive);
        
        if (live) {
          setLiveStream(live);
        } else {
          setLiveStream(null);
        }
      } catch (error) {
        console.error("Failed to fetch live stream:", error);
      }
    };

    getLiveStream();
  }, []);

  return (
    <div className="navbar-stream">
      {liveStream ? (
        <div className="live-video">
          <h3>현재 생방송 중!</h3>
          <video
            src={liveStream.videoUrl}
            controls
            autoPlay
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ) : (
        <p>현재 생방 중인 채널이 없습니다</p>
      )}
    </div>
  );
}

export default NavbarStream;

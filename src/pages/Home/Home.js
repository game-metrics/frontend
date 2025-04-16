import React from 'react';
import StreamList from '../../components/Home/StreamList.js';
import VideoList from '../../components/Home/VideoList.js';
import GoogleAd from '../../components/Home/GoogleAd.js';
import "./css/Home.css";

function Home() {
  return (
    <div className="home">
    
      <StreamList />
      <VideoList />

    </div>
  );
}

export default Home;

import React from 'react';
import StreamList from '../../components/Home/StreamList.js';
import NavbarStream from '../../components/Home/NavbarStream.js';
import VideoList from '../../components/Home/VideoList.js';
import "./css/Home.css";

function Home() {
  return (
    <div className="home">
      <NavbarStream />
      <StreamList />
      <VideoList/>
    </div>
  );
}

export default Home;

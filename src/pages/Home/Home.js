import React from 'react';
import StreamList from '../../components/Home/StreamList.js';
import VideoList from '../../components/Home/VideoList.js';
import UserList from '../../components/Home/UserList.js';
import "./css/Home.css";

function Home() {
  return (
    <div className="home">
    
      <StreamList />
      <VideoList />
      <UserList/>
    </div>
  );
}

export default Home;

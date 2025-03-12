import React from 'react';
import StreamList from './StreamList.js';
import NavbarStream from './NavbarStream.js';
import "./css/Home.css";

function Home() {
  return (
    <div className="home">
      <NavbarStream />
      <StreamList />
    </div>
  );
}

export default Home;

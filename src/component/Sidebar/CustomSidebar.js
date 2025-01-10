import React, { useState } from "react";
import './CustomSidebar.css';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

function CustomSidebar() {
  // State to manage sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // // Following streamer
  // const [FollowingListError, setFollowingListError] = useState(false); // Image load error state

  // Live streamer
  const [StreamListError, setStreamListError] = useState(false); // Image load error state
  const handleImageError = () => {
    setStreamListError(true); // Set state when image fails to load
    // setFollowingListError(true);
  };

  return (
    <div className="over-all-div">

      {/* Sidebar */}
      {isSidebarVisible && (
        <div className="menu">
          <Sidebar className="sidebar">
            <Menu>
              <h1 className="follow-text">팔로우 중인 채널</h1>
              {!StreamListError ? (
                <>
                  {/* Temporary image; to be replaced with a list */}
                  <img
                    src="https://gamemetric-imogi-s3.s3.ap-northeast-2.amazonaws.com/gameMetricLogo.png"
                    alt="GameMetric Logo"
                    onError={handleImageError} // Image load error handler
                  />
                  <MenuItem>1</MenuItem>
                  <MenuItem>2</MenuItem>
                </>
              ) : (
                <>
                  <br />
                  <span style={{ marginLeft: "1%" }}>
                    현재 팔로우 중인 채널이 없습니다
                  </span>
                </>
              )}
            </Menu>
            <br />
            {/* Popular live broadcasts */}
            <Menu>
              <h1 className="follow-text">실시간 인기 방송</h1>
              {!StreamListError ? (
                <>
                  <MenuItem>1</MenuItem>
                  <MenuItem>2</MenuItem>
                </>
              ) : (
                <>
                  <br />
                  <span style={{ marginLeft: "5%" }}>
                    현재 방송중인 채널이 없습니다
                  </span>
                </>
              )}
            </Menu>
          </Sidebar>
        </div>
      )}
       {/* Toggle Button */}
       <button className="toggle-button" onClick={toggleSidebar}>
        {isSidebarVisible ? '<<' : '>>'}
      </button>
    </div>
  );
}

export default CustomSidebar;

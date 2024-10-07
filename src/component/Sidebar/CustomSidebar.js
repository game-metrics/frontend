import React, { useState } from "react";
import './CustomSidebar.css';
import { Sidebar, Menu, MenuItem} from 'react-pro-sidebar';

function CustomSidebar() {

  // following steamer
  const [FollowingListError, setFollowingListError] = useState(false); // 이미지 로드 실패 여부 상태

  // live streamer
  const [StreamListError, setStreamListError] = useState(false); // 이미지 로드 실패 여부 상태
  const handleImageError = () => {
    setStreamListError(true); // 이미지 로드 실패 시 상태 변경
    setFollowingListError(true);
  };


  //  return
  return (
< div className ='menu'>
  <Sidebar className='sidebar'>
  <Menu>
    <h1 className='follow-text'>팔로우 중인 채널</h1>
    {!StreamListError ? (
  <>
  {/* 일단은 임시로 이미지로 해놈 list 로 변경할 예정*/}
    <img
      src="https://gamemetric-imogi-s3.s3.ap-northeast-2.amazonaws.com/gameMetricLogo.png"
      alt="GameMetric Logo"
      onError={handleImageError} // 이미지 로드 실패 시 호출
    />
    <MenuItem>1</MenuItem>
    <MenuItem>2</MenuItem>
  </>
) : (
  <>
  <br />
   <span style={{marginLeft : "1%"}}> 현제  팔로우 중인 채널이 없습니다</span>
  </>
)}
  </Menu>
  <br />
  {/* 인기 방송 리스트 */}
  <Menu>
    <h1 className='follow-text'>실시간 인기 방송</h1>
    {!StreamListError ? (
  <>
    <img
      src="https://gamemetric-imogi-s3.s3.ap-northeast-2.amazonaws.com/gameMetricLogo.png"
      alt="GameMetric Logo"
      onError={handleImageError} // 이미지 로드 실패 시 호출
    />
    <MenuItem>1</MenuItem>
    <MenuItem>2</MenuItem>
  </>
) : (
  <>
  <br />
   <span style={{marginLeft : "5%"}}> 현제 방송중이 채널이 없습니다</span>
  </>
)}

  </Menu>
  </Sidebar>
</div>
  )
}

export default CustomSidebar

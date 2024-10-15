import React, { useState } from "react";
import "./Header.css";
import SearchIcon from '@mui/icons-material/Search';

function Header() {
  const [logoError, setLogoError] = useState(false); // 이미지 로드 실패 여부 상태

  const handleImageError = () => {
    setLogoError(true); // 이미지 로드 실패 시 상태 변경
  }; 

  return (
<div className="header">
      {/* logo */}
      {!logoError ? (
        <img
          className="header__logo"
          src="https://gamemetric-imogi-s3.s3.ap-northeast-2.amazonaws.com/gameMetricLogo.png"
          alt="GameMetric Logo"
          onError={handleImageError} // 이미지 로드 실패 시 호출
        />
      ) : (
        <span className="header__logoError">이미지가 없습니다</span> // 대체 텍스트
      )}

      {/* search bar and icon */}
      <div className="header__search">
        <input className="header__searchInput" type="text" id="search"/>
        <SearchIcon className="header__searchIcon" />
      </div>

      {/* login & profile */}
      <div className="header__nav">
        
        {/* 로그인은 팝업으로 */}
          <div className="header__option">
            <span className="header__optionLineOne">Hello</span>
            <span className="header__optionLineTwo">Sign In</span>
          </div>
        
        
        <a href="/BroadCast">
          <div className="header__option">
            <span className="header__optionLineOne">Start</span>
            <span className="header__optionLineTwo">BroadCast</span>
          </div>
        </a>

        <a href="/Profile">
          <div className="header__option">
            <span className="header__optionLineOne">Your</span>
            <span className="header__optionLineTwo">Profile</span>
          </div>
        </a>
      </div>
</div>
  );
}

export default Header;

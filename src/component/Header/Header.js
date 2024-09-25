import React from "react";
import "./Header.css";
import SearchIcon from '@mui/icons-material/Search';

function Header() {  
  return (
    <div className="header">

        {/* logo */}
        <img
          className="header__logo"
          src="https://gamemetric-imogi-s3.s3.ap-northeast-2.amazonaws.com/gameMetricLogo.png"
          alt=""
        />
      
      {/* search bar and icon */}
      <div className="header__search">
        <input className="header__searchInput" type="text" id="search"/>
        <SearchIcon className="header__searchIcon" />
      </div>

      {/* login & profile */}
      <div className="header__nav">
        
          <div className="header__option">
            <span className="header__optionLineOne">Hello</span>
            <span className="header__optionLineTwo">Sign In</span>
          </div>
    

        <div className="header__option">
          <span className="header__optionLineOne">Your</span>
          <span className="header__optionLineTwo">BroadCast</span>
        </div>

        <div className="header__option">
        </div>
      </div>
    </div>
  );
}

export default Header;
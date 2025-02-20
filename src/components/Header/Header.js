import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../images/logo1.png";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu"; // 메뉴 아이콘 추가

function Header({ toggleSidebar }) { // 사이드바 토글 함수 받음
  const [logoError, setLogoError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nickname, setNickname] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const token = getCookie("auth");
    const userNickname = getCookie("nickname");

    setIsAuthenticated(Boolean(token));
    if (userNickname) {
      setNickname(userNickname);
    }
  }, []);

  const handleImageError = () => {
    setLogoError(true);
  };

  const handleLogout = () => {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "nickname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setNickname("");
    alert("로그아웃되었습니다.");
    window.location.reload();
  };

  return (
    <div className="header">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <MenuIcon />
      </button>

      {!logoError ? (
        <a href="/">
          <img className="header__logo" src={logo} alt="GameMetric 로고" onError={handleImageError} />
        </a>
      ) : (
        <span className="header__logoError">이미지가 없습니다</span>
      )}

      <div className="header__search">
        <input className="header__searchInput" type="text" id="search" />
        <SearchIcon className="header__searchIcon" />
      </div>

      <div className="header__nav">
        {!isAuthenticated ? (
          <a href="/sign-in">
            <div className="header__option">
              <span className="header__optionLineOne">Hello</span>
              <span className="header__optionLineTwo">Sign In</span>
            </div>
          </a>
        ) : (
          <div className="header__option" onClick={handleLogout} style={{ cursor: "pointer" }}>
            <span className="header__optionLineOne">{nickname ? `${nickname}` : "Hello"}</span>
            <span className="header__optionLineTwo">Log Out</span>
          </div>
        )}

        {isAuthenticated && (
          <a href="/broadcast-setup">
            <div className="header__option">
              <span className="header__optionLineOne">Start</span>
              <span className="header__optionLineTwo">BroadCast</span>
            </div>
          </a>
        )}

        {isAuthenticated && (
          <a href="/profile">
            <div className="header__option">
              <span className="header__optionLineOne">Your</span>
              <span className="header__optionLineTwo">Profile</span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

export default Header;

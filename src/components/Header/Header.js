import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../images/logo1.png";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

function Header({ toggleSidebar }) {
  const [logoError, setLogoError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nickname, setNickname] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    const userNickname = localStorage.getItem("nickname");

    setIsAuthenticated(Boolean(token));
    if (userNickname) {
      setNickname(userNickname);
    }
  }, []);

  const handleImageError = () => {
    setLogoError(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("nickname");
    localStorage.removeItem("followedUsers");
    setIsAuthenticated(false);
    setNickname("");
    alert("로그아웃되었습니다.");
    window.location.href = "/";
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
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
          <input
          className="header__searchInput"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어 입력"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="header__searchButton" onClick={handleSearch}>
          <SearchIcon />
        </button>
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
            <span className="header__optionLineOne">{nickname || "Hello"}</span>
            <span className="header__optionLineTwo">Log Out</span>
          </div>
        )}

        {isAuthenticated && (
          <>
            <a href="/broadcast-setup">
              <div className="header__option">
                <span className="header__optionLineOne">Start</span>
                <span className="header__optionLineTwo">BroadCast</span>
              </div>
            </a>

            <a href="/upload-video">
              <div className="header__option">
                <span className="header__optionLineOne">Upload</span>
                <span className="header__optionLineTwo">Video</span>
              </div>
            </a>

            <div className="header__optionDropdownWrapper">
              <div className="header__option">
                <span className="header__optionLineOne">Your</span>
                <span className="header__optionLineTwo">Account</span>
              </div>
              <div className="header__dropdown">
                <a href={`/profile/${nickname}`} className="header__dropdownItem">Profile</a>
                <a href="/setting" className="header__dropdownItem">Settings</a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;

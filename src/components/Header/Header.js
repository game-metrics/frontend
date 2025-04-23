import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";
import logo from "../../images/logo1.png";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

function Header({ toggleSidebar }) {
  const { isAuthenticated, nickname, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="header">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <MenuIcon />
      </button>

      <Link to="/">
        <img className="header__logo" src={logo} alt="GameMetric 로고" />
      </Link>

      <div className="header__search">
        <input
          className="header__searchInput"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="검색어 입력"
        />
        <button className="header__searchButton" onClick={handleSearch}>
          <SearchIcon />
        </button>
      </div>

      <div className="header__nav">
        {!isAuthenticated ? (
          <Link to="/sign-in">
            <div className="header__option">
              <span className="header__optionLineOne">Hello</span>
              <span className="header__optionLineTwo">Sign In</span>
            </div>
          </Link>
        ) : (
          <>
            <div className="header__option" onClick={logout}>
              <span className="header__optionLineOne">{nickname}</span>
              <span className="header__optionLineTwo">Log Out</span>
            </div>

            <Link to="/broadcast-setup">
              <div className="header__option">
                <span className="header__optionLineOne">Start</span>
                <span className="header__optionLineTwo">BroadCast</span>
              </div>
            </Link>

            <Link to="/upload-video">
              <div className="header__option">
                <span className="header__optionLineOne">Upload</span>
                <span className="header__optionLineTwo">Video</span>
              </div>
            </Link>

            <div className="header__optionDropdownWrapper">
              <div className="header__option">
                <span className="header__optionLineOne">Your</span>
                <span className="header__optionLineTwo">Account</span>
              </div>
              <div className="header__dropdown">
                <Link to={`/profile/${nickname}`} className="header__dropdownItem">
                  Profile
                </Link>
                <Link to="/setting" className="header__dropdownItem">
                  Settings
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../images/logo1.png";
import SearchIcon from "@mui/icons-material/Search";

function Header() {
  const [logoError, setLogoError] = useState(false); // Image load failure state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  // Helper function to get the value of a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    // Check if the 'auth' cookie exists
    const token = getCookie("auth");
    console.log("Cookie token:", token); // Debug: Check the token value
    setIsAuthenticated(Boolean(token)); // Update state based on token presence
  }, []);

  const handleImageError = () => {
    setLogoError(true); // Update state on image load failure
  };

  // 로그 아웃
  const handleLogout = () => {
    console.log("Logging out..."); // Debug: Confirm logout
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Remove the cookie
    setIsAuthenticated(false); // Update authentication state
    alert("You have been logged out."); // Show alert message
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="header">
      {!logoError ? (
        <a href="/">
          <img
            className="header__logo"
            src={logo}
            alt="GameMetric Logo"
            onError={handleImageError}
          />
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
          <div
            className="header__option"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <span className="header__optionLineOne">Hello</span>
            <span className="header__optionLineTwo">Log Out</span>
          </div>
        )}

        <a href="/stream">
          <div className="header__option">
            <span className="header__optionLineOne">Start</span>
            <span className="header__optionLineTwo">BroadCast</span>
          </div>
        </a>

        <a href="/profile">
        <a href="/profile">
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

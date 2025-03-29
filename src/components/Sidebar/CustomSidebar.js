import React from "react";
import { useNavigate } from "react-router-dom";
import "./CustomSidebar.css";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

function CustomSidebar({ isSidebarOpen }) {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const isAuthenticated = !!localStorage.getItem("auth"); // auth 값이 존재하면 true

  return (
    <Sidebar collapsed={!isSidebarOpen} className="sidebar">
      <Menu>
        {/* 홈 버튼 - 클릭 시 메인 페이지로 이동 */}
        <MenuItem className="home-button" onClick={() => navigate("/")}>
          🏠 Home
        </MenuItem>

        {/* 인증 여부에 따른 메뉴 표시 */}
        {isAuthenticated ? (
          <>
            <h1 className="follow-text">Following Users</h1>
            <MenuItem>채널 1</MenuItem>
            <MenuItem>채널 2</MenuItem>
          </>
        ) : (
          <MenuItem>
            <button className="login-button" onClick={() => navigate("/sign-in")}>
              Log in
            </button>
          </MenuItem>
        )}
      </Menu>
    </Sidebar>
  );
}

export default CustomSidebar;

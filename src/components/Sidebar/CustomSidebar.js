import React from "react";
import "./CustomSidebar.css";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

function CustomSidebar({ isSidebarOpen }) {
  return (
    <Sidebar collapsed={!isSidebarOpen} className="sidebar">
      <Menu>
      {isSidebarOpen &&<h1 className="follow-text">팔로우 중인 채널</h1>}
        <MenuItem>1</MenuItem>
        <MenuItem>2</MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default CustomSidebar;

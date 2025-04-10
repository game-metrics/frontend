import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomSidebar.css";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

function CustomSidebar({ isSidebarOpen }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("auth");
  const backendBase = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("auth");

  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${backendBase}/follows?page=0&size=5`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch followed users.");
          console.log(res);
          return res.json();
        })
        .then((data) => {
          setFollowedUsers(data.data?.content || []);
        })
        .catch((err) => {
          console.error("Error fetching followed users:", err);
        });
    }
  }, [isAuthenticated, backendBase, token]);

  return (
    <Sidebar collapsed={!isSidebarOpen} className="sidebar">
      <Menu>
        {isAuthenticated ? (
          <>
            <h1 className="follow-text">Following Users</h1>
            {followedUsers.length > 0 ? (
              followedUsers.map((user, index) => (
                <MenuItem key={user.id || index}>
                  {user.nickname || user.username || `User ${index + 1}`}
                </MenuItem>
              ))
            ) : (
              <MenuItem>No followed users</MenuItem>
            )}
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

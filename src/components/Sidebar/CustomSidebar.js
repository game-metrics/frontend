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
    if (!isAuthenticated) return;

    const fetchFollowedUsers = () => {
      const cachedFollows = localStorage.getItem("followedUsers");

      if (cachedFollows) {
        setFollowedUsers(JSON.parse(cachedFollows));
      } else {
        fetch(`${backendBase}/follows?page=0&size=5`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch followed users.");
            return res.json();
          })
          .then((data) => {
            const users = data.data?.content || [];
            setFollowedUsers(users);
            localStorage.setItem("followedUsers", JSON.stringify(users));
          })
          .catch((err) => {
            console.error("Error fetching followed users:", err);
          });
      }
    };

    fetchFollowedUsers();

    // Listen for follow updates from other components
    window.addEventListener("followUpdated", fetchFollowedUsers);

    // Cleanup
    return () => {
      window.removeEventListener("followUpdated", fetchFollowedUsers);
    };
  }, [isAuthenticated, backendBase, token]);

  return (
    <Sidebar collapsed={!isSidebarOpen} className="sidebar">
      <Menu>
        {isAuthenticated ? (
          <>
            <h1 className="follow-text">Follow</h1>
            {followedUsers.length > 0 ? (
              followedUsers.map((user, index) => (
                <MenuItem
                  key={user.id || index}
                  onClick={() => navigate(`/profile/${user.streamerName}`)}
                >
                  {user.streamerName || `User ${index + 1}`}
                </MenuItem>
              ))
            ) : (
              <MenuItem>No followed users</MenuItem>
            )}
          </>
        ) : (
          <MenuItem>
            <button
              className="login-button"
              onClick={() => navigate("/sign-in")}
            >
              Log in
            </button>
          </MenuItem>
        )}
      </Menu>
    </Sidebar>
  );
}

export default CustomSidebar;

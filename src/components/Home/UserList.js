import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/UserList.css';
import userIcon from "../../images/user.png";
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const backendBase = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendBase}/users/page?page=0&size=6`)
      .then(response => {
        const userData = response.data?.data?.content || [];
        setUsers(userData);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [backendBase]);

  const getProfileImage = (url) => {
    return url || userIcon;
  };

  const handleUserClick = (nickname) => {
    navigate(`/profile/${nickname}`);
  };

  return (
    <div className="user-list-container">
      <div className="user-list-scroll">
        {users.map((user, index) => (
          <div
            key={index}
            className="user-item"
            onClick={() => handleUserClick(user.nickname)}
            style={{ cursor: 'pointer' }} // 클릭 가능 표시
          >
            <img
              src={getProfileImage(user.profileImageUrl)}
              alt={user.nickname}
              className="user-avatar"
            />
            {user.nickname && <span className="user-name">{user.nickname}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;

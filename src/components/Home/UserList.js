import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/UserList.css';
import userIcon from "../../images/user.png";

const UserList = () => {
  const [users, setUsers] = useState([]);
  //todo : serperate api to api file
  const backendBase = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendBase}/users/page?page=0&size=5`)
      .then(response => {
        const userData = response.data?.data?.content || [];
        setUsers(userData);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [backendBase]);

  // 프로필 이미지가 없을 경우 기본 이미지 사용
  const getProfileImage = (url) => {
    return url || userIcon;
  };

  return (
    <div className="user-list-container">
      <div className="user-list-scroll">
        {users.map((user, index) => (
          <div key={index} className="user-item">
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
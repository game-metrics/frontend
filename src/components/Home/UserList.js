import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/UserList.css';
import userIcon from "../../images/user.png";
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const backendBase = process.env.REACT_APP_BACKEND_URL;
  const PAGE_SIZE = 7;

  useEffect(() => {
    axios.get(`${backendBase}/users/page?page=${page}&size=${PAGE_SIZE}`)
      .then(response => {
        const userData = response.data?.data?.content || [];
        setUsers(userData);
        // console.log(response.data.data.page.totalPages);
        setTotalPages(response.data?.data?.page?.totalPages || 1);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [page, backendBase]);

  const getProfileImage = (url) => {
    return url || userIcon;
  };

  const handleUserClick = (nickname) => {
    navigate(`/profile/${nickname}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-scroll">
        {users.map((user, index) => (
          <div
            key={index}
            className="user-item"
            onClick={() => handleUserClick(user.nickname)}
            style={{ cursor: 'pointer' }}
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              style={{
                margin: '0 5px',
                padding: '6px 10px',
                borderRadius: '4px',
                backgroundColor: i === page ? '#007bff' : '#e0e0e0',
                color: i === page ? '#fff' : '#000',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;

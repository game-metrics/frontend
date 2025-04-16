import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  //todo : serperate api to api file
  const backendBase = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios.get(backendBase+'/users/page?page=0&size=5')
      .then(response => {
        const userData = response.data?.data?.content || [];
        setUsers(userData);
        console.log(users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  });

  return (
    <div className="w-full overflow-x-auto whitespace-nowrap p-4 bg-white shadow rounded-xl">
      <div className="flex space-x-6">
        {users.map((user, index) => (
          <div key={index} className="flex flex-col items-center min-w-[80px]">
            <img
              src={user.profileImage}
              alt={user.nickname}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;

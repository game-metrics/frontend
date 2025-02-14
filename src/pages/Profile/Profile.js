import React, { useState } from "react";
import axios from "axios";
import "./css/Profile.css";

const Profile = () => {
  const [username, setUsername] = useState("사용자 이름");
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const backendBase = process.env.REACT_APP_BACKEND_URL;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendBase+"/users", {
        currentPassword,
        newPassword,
      });
      setMessage("비밀번호 변경 성공!");
    } catch (error) {
      setMessage("비밀번호 변경 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">프로필 페이지</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">사용자 이름</label>
        <input
          type="text"
          className="w-full p-2 border rounded mt-1"
          value={username}
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">이메일</label>
        <input
          type="email"
          className="w-full p-2 border rounded mt-1"
          value={email}
          disabled
        />
      </div>
      <h3 className="text-xl font-semibold mt-6 mb-4">비밀번호 변경</h3>
      <form onSubmit={handlePasswordChange}>
        <div className="mb-4">
          <label className="block text-sm font-medium">현재 비밀번호</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">새 비밀번호</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          변경하기
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default Profile;

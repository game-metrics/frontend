import { useState, useEffect } from "react";
import { fetchProfile, changePassword } from "../../api/profile/ProfileApi.js";
import "./css/Profile.css";

const Profile = () => {
  const [nickname, setNickname] = useState("사용자 이름");
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // localStorage에서 nickname과 auth 가져오기
        const storedNickname = localStorage.getItem("nickname");
        const token = localStorage.getItem("auth");

        if (storedNickname && token) {
          setNickname(storedNickname);
        }

        // 프로필 정보 API 호출
        const data = await fetchProfile(token);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await changePassword(currentPassword, newPassword);
      setMessage(response.data ? "Password change successful" : "Incorrect current password");
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-field">
        <label className="profile-label">User's Name</label>
        <input type="text" className="profile-input" value={nickname} disabled />
      </div>
      <div className="profile-field">
        <label className="profile-label">이메일</label>
        <input type="email" className="profile-input" value={email} disabled />
      </div>
      <h3 className="password-change-title">Change password</h3>
      <form onSubmit={handlePasswordChange}>
        <div className="profile-field">
          <label className="profile-label">Current password</label>
          <input
            type="password"
            className="profile-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">New password</label>
          <input
            type="password"
            className="profile-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          변경하기
        </button>
      </form>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default Profile;

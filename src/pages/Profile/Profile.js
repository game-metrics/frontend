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
        const data = await fetchProfile();
        setNickname(data.nickname);
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">User's Name</label>
        <input type="text" className="w-full p-2 border rounded mt-1" value={nickname} disabled />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">이메일</label>
        <input type="email" className="w-full p-2 border rounded mt-1" value={email} disabled />
      </div>
      <h3 className="text-xl font-semibold mt-6 mb-4">Change password</h3>
      <form onSubmit={handlePasswordChange}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Current password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">New password</label>
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

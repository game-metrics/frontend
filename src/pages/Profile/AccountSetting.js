import { useState, useEffect } from "react";
import {
  fetchProfile,
  changePassword,
  uploadProfileImage,
  updateProfileImage,
} from "../../api/profile/ProfileApi.js";
import userIcon from "../../images/user.png";
import "./css/Profile.css";

const AccountSetting = () => {
  const [nickname, setNickname] = useState("Username");
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [previewUrl, setPreviewUrl] = useState(userIcon);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("auth");
      if (!token) {
        alert("Please log in.");
        window.location.href = "/";
        return;
      }

      try {
        const storedNickname = localStorage.getItem("nickname");
        if (storedNickname) setNickname(storedNickname);

        const data = await fetchProfile(token);
        setEmail(data.email);
        if (data.profileImage) setPreviewUrl(data.profileImage);
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
      setMessage(response.data ? "Password changed successfully" : "Incorrect current password");
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const imageUrl = await uploadProfileImage(file);
      console.log(imageUrl);
      await updateProfileImage(imageUrl);
      setMessage("Profile image updated successfully.");
    } catch (error) {
      console.error("Image upload or profile update failed", error);
      setMessage("Image update failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      <div className="profile-image-section">
        <img src={previewUrl} alt="Profile" className="profile-image" />
        <label htmlFor="imageUpload" className="image-upload-label">
          Change Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="profile-field">
        <label className="profile-label">Username</label>
        <input type="text" className="profile-input" value={nickname} disabled />
      </div>

      <div className="profile-field">
        <label className="profile-label">Email</label>
        <input type="email" className="profile-input" value={email} disabled />
      </div>

      <h3 className="password-change-title">Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div className="profile-field">
          <label className="profile-label">Current Password</label>
          <input
            type="password"
            className="profile-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">New Password</label>
          <input
            type="password"
            className="profile-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Update
        </button>
      </form>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default AccountSetting;

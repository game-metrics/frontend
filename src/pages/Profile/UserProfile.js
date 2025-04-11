import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import noimage from "../../images/no-image-icon-23485.png";
import userIcon from "../../images/user.png";
import "./css/UserProfile.css";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [streams, setStreams] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem("auth");
  const currentNickname = localStorage.getItem("nickname");

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_BASE_URL}/users/${username}`);
        const userData = await userRes.json();
        setProfile(userData.data);

        const streamRes = await fetch(`${API_BASE_URL}/broadcasts/${username}`);
        const streamData = await streamRes.json();
        setStreams(streamData.data.content || []);

        const videoRes = await fetch(`${API_BASE_URL}/videos/profile/${username}`);
        const videoData = await videoRes.json();
        setVideos(videoData.data.content || []);

        if (token) {
          const followRes = await fetch(`${API_BASE_URL}/follows?page=0&size=100`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          const followData = await followRes.json();
          const followed = followData.data?.content || [];

          const isFollowingUser = followed.some(
            (user) =>
              user.streamerName === username || user.username === username
          );
          setIsFollowing(isFollowingUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [username, token]);

  const handleFollowToggle = async () => {
    if (!token) {
      alert("You need to be logged in to follow/unfollow.");
      return;
    }

    try {
      const storageKey = "followedUsers";
      const storedFollows = JSON.parse(localStorage.getItem(storageKey)) || [];

      if (isFollowing) {
        const response = await fetch(`${API_BASE_URL}/follows?streamerName=${username}`, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          setIsFollowing(false);
          alert("Unfollowed successfully.");
          const updatedFollows = storedFollows.filter(
            (user) =>
              user.streamerName !== username &&
              user.username !== username
          );
          localStorage.setItem(storageKey, JSON.stringify(updatedFollows));
          navigate(0);
        } else {
          alert("Failed to unfollow.");
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/follows?streamerName=${username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          setIsFollowing(true);
          alert("Followed successfully.");
          const newUser = { username, streamerName: username };
          const updatedFollows = [...storedFollows, newUser];
          localStorage.setItem(storageKey, JSON.stringify(updatedFollows));
        } else {
          alert("Failed to follow.");
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleDeleteVideo = async (videoId, e) => {
    e.stopPropagation(); // Prevent navigate on card click

    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.ok) {
        alert("Video deleted successfully.");
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
      } else {
        alert("Failed to delete video.");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="user-profile">
      {/* User Info */}
      {profile && (
        <div className="profile-card">
          <img
            src={profile.profileImage || userIcon}
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-info">
            <h2>{profile.nickname}</h2>
            <p>{profile.email}</p>
            <button
              className={`follow-button ${isFollowing ? "unfollow" : ""}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      )}

      {/* Streams */}
      <div className="section">
        <h2 className="section-title">Past Streams</h2>
        {streams.length > 0 ? (
          <div className="card-list">
            {streams.map((stream, index) => (
              <div key={index} className="card">
                <img
                  src={stream.thumbNailUrl || noimage}
                  alt="Stream Thumbnail"
                />
                <h4>{stream.title}</h4>
                <p>Category: {stream.categoryId}</p>
                <p>Created At: {stream.createdAt}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No streams are found.</p>
        )}
      </div>

      {/* Videos */}
      <div className="section">
        <h2 className="section-title">Videos</h2>
        {videos.length > 0 ? (
          <div className="card-list">
            {videos.map((video) => (
              <div
                key={video.id}
                className="card"
                onClick={() => navigate(`/watch/${video.id}`)}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <img
                  src={video.thumbNailUrl || noimage}
                  alt="Video Thumbnail"
                />
                <h4>{video.title}</h4>
                <p>Created At: {video.createdAt}</p>

                {/* 삭제 버튼 조건: 로그인 유저 nickname === 프로필 닉네임 */}
                {profile?.nickname === currentNickname && (
                  <button
                    className="delete-button"
                    onClick={(e) => handleDeleteVideo(video.id, e)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "transparent",
                      border: "none",
                      fontSize: "20px",
                      color: "#f44336",
                      cursor: "pointer",
                    }}
                    title="Delete Video"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

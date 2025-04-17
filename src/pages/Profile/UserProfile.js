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
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("auth");
  const currentNickname = localStorage.getItem("nickname");

  useEffect(() => {
    // Load and transform categories from localStorage
    try {
      const storedData = JSON.parse(localStorage.getItem("listData"));
      if (storedData?.data?.length) {
        const formattedCategories = storedData.data.map(item => ({
          id: item.id,
          name: item.category
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }

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
            (user) => user.streamerName === username || user.username === username
          );
          setIsFollowing(isFollowingUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [username, token]);

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "No category";
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  };

  const handleFollowToggle = async () => {
    if (!token) {
      alert("You need to be logged in to follow/unfollow.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/follows?streamerName=${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        alert(`${isFollowing ? "Unfollowed" : "Followed"} successfully`);
        navigate(0); // Refresh the page
      } else {
        alert(`Failed to ${isFollowing ? "unfollow" : "follow"}`);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleDeleteVideo = async (videoId, e) => {
    e.stopPropagation();

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
        setVideos(prev => prev.filter(v => v.id !== videoId));
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
            src={profile.profileImageUrl || userIcon}
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
                <p>Category: {getCategoryName(stream.categoryId)}</p>
                <p>Created At: {new Date(stream.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No streams found.</p>
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
                <p>Created At: {new Date(video.createdAt).toLocaleString()}</p>

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
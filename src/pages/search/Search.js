import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUsers, fetchBroadcasts, fetchVideos } from "../../api/search/SearchApi";
import "./css/SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";

  const [users, setUsers] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    Promise.all([fetchUsers(query), fetchBroadcasts(query), fetchVideos(query)])
      .then(([userData, broadcastData, videoData]) => {
        setUsers(userData?.data?.content || []);
        setBroadcasts(broadcastData?.data?.content || []);
        setVideos(videoData?.data?.content || []);
      })
      .catch((error) => {
        console.error("Error loading search data:", error);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-results">
      <h2 className="search-title">🔍 Search Results</h2>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {/* 유저 결과 */}
          <div className="result-section">
            <h3 className="section-title">👤 User Results</h3>
            {users.length === 0 ? (
              <p className="no-results">No users found</p>
            ) : (
              <ul className="result-list">
                {users.map((user, index) => (
                  <li
                    key={index}
                    className="result-item"
                    onClick={() => navigate(`/profile/${user.nickname}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="nickname">{user.nickname}</span> ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 방송 결과 */}
          <div className="result-section">
            <h3 className="section-title">📺 Broadcast Results</h3>
            {broadcasts.length === 0 ? (
              <p className="no-results">No broadcasts found</p>
            ) : (
              <ul className="result-list">
                {broadcasts.map((broadcast) => (
                  <li
                    key={broadcast.id}
                    className="result-item"
                    onClick={() => navigate(`/broadcast?id=${broadcast.id}`)} // ✅ 방송 클릭 시 이동
                    style={{ cursor: "pointer" }}
                  >
                    <img className="thumbnail" src={broadcast.thumbNailUrl} alt={broadcast.title} />
                    <div className="broadcast-info">
                      <p className="title">Title: {broadcast.title}</p>
                      <p className="created-at">Created At: {broadcast.createdAt}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 비디오 결과 */}
          <div className="result-section">
            <h3 className="section-title">🎥 Video Results</h3>
            {videos.length === 0 ? (
              <p className="no-results">No videos found</p>
            ) : (
              <ul className="result-list">
                {videos.map((video) => (
                  <li
                    key={video.id}
                    className="result-item"
                    onClick={() => navigate(`/watch/${video.id}`)} // ✅ 비디오 클릭 시 이동
                    style={{ cursor: "pointer" }}
                  >
                    <img className="thumbnail" src={video.thumbNailUrl} alt={video.title} />
                    <span className="video-link">{video.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;

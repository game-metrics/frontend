import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./css/SearchResults.css"; 

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";

  const [users, setUsers] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchUsers = fetch(`http://13.125.236.56:8080/users/search?name=${query}&page=0&size=3`).then(res => res.json());
    const fetchBroadcasts = fetch(`http://13.125.236.56:8080/broadcasts/search?title=${query}&page=0&size=3`).then(res => res.json());
    const fetchVideos = fetch(`http://13.125.236.56:8080/videos/search?videoTitle=${query}&page=0&size=3`).then(res => res.json());

    Promise.all([fetchUsers, fetchBroadcasts, fetchVideos])
      .then(([userData, broadcastData, videoData]) => {
        setUsers(userData.data?.content || []);
        setBroadcasts(broadcastData.data?.content || []);
        setVideos(videoData.data?.content || []);
      })
      .catch((error) => {
        console.error("검색 데이터 로드 오류:", error);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-results">
      <h2 className="search-title">🔍 검색 결과</h2>

      {loading ? (
        <p className="loading">로딩 중...</p>
      ) : (
        <>
          <div className="result-section">
            <h3 className="section-title">👤 유저 검색 결과</h3>
            {users.length === 0 ? <p className="no-results">검색된 유저 없음</p> : (
              <ul className="result-list">
                {users.map((user) => (
                  <li key={user.email} className="result-item">
                    <span className="nickname">{user.nickname}</span> ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="result-section">
            <h3 className="section-title">📺 방송 검색 결과</h3>
            {broadcasts.length === 0 ? <p className="no-results">검색된 방송 없음</p> : (
              <ul className="result-list">
                {broadcasts.map((broadcast) => (
                  <li key={broadcast.id} className="result-item">
                    <img className="thumbnail" src={broadcast.thumbNailUrl} alt={broadcast.title} />
                    <span className="title">{broadcast.title}</span> (카테고리: {broadcast.categoryId})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="result-section">
            <h3 className="section-title">🎥 비디오 검색 결과</h3>
            {videos.length === 0 ? <p className="no-results">검색된 비디오 없음</p> : (
              <ul className="result-list">
                {videos.map((video) => (
                  <li key={video.id} className="result-item">
                    <img className="thumbnail" src={video.thumbNailUrl} alt={video.title} />
                    <a className="video-link" href={video.videoUrl} target="_blank" rel="noopener noreferrer">{video.title}</a>
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

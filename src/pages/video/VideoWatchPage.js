import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/VideoWatchPage.css";
import VideoList from '../../components/Home/VideoList.js';
import VideoPlayer from '../../components/Home/VideoPlayer'; // VideoPlayer 컴포넌트 임포트

const VideoWatchPage = () => {
  const { videoId } = useParams();
  const [videoUrl, setVideoUrl] = useState(""); // 비디오 URL
  const [videoData, setVideoData] = useState(null); // 비디오 데이터

  const backendBase = process.env.REACT_APP_BACKEND_URL;

  // 비디오가 바뀔 때마다 다시 불러오기
  useEffect(() => {
    // 새 videoId가 오면 비디오 데이터 초기화
    setVideoData(null);
    setVideoUrl(""); // videoUrl 초기화

    const fetchVideoData = async () => {
      try {
        const res = await fetch(`${backendBase}/videos/${videoId}`);
        const data = await res.json();
        setVideoData(data.data);  
        setVideoUrl(data.data.videoUrl);
        console.log(data.data);
      } catch (err) {
        console.error("비디오 정보를 불러오는 중 오류:", err);
      }
    };

    fetchVideoData();
  }, [videoId, backendBase]); // videoId가 변경될 때마다 실행

  // 페이지 이동 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [videoId]); // videoId가 바뀔 때마다 맨 위로 스크롤

  return (
    <div className="video-page-container">
      <div className="video-main">
        <div className="video-wrapper">
          {/* videoUrl이 있을 때만 렌더링 */}
          {videoUrl ? (
            <div className="video-player-container">
              <VideoPlayer key={videoId} src={videoUrl} />
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading Video...</p>
          )}

          {/* 비디오 데이터가 있을 때 제목과 설명 표시 */}
          {videoData && (
            <div className="video-title">
              <h2>{videoData.title}</h2>
              <p>{videoData.description}</p>
            </div>
          )}
        </div>

        {/* 댓글 섹션 (개발 중) */}
        <div className="comment-section">
          <h3>Comments</h3>
          <p className="text-sm text-gray-500">Comments Entity and Function is on Development</p>
        </div>
      </div>

      {/* 사이드바에 비디오 리스트 */}
      <div className="sidebar">
        <VideoList />
      </div>
    </div>
  );
};

export default VideoWatchPage;

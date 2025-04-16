import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/VideoWatchPage.css";
import VideoList from '../../components/Home/VideoList.js';

const VideoWatchPage = () => {
  const { videoId } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState(null);

  const backendBase = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
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
  }, [videoId, backendBase]);

  return (
    <div className="video-page-container">
      <div className="video-main">
        <div className="video-wrapper">
          {videoUrl ? (
            <div className="video-player-container">
              <video controls className="video-player">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading Video...</p>
          )}

          {videoData && (
            <div className="video-title">
              <h2>{videoData.title}</h2>
              <p>{videoData.description}</p>
            </div>
          )}
        </div>
          {/* 이사이에 유저의  */}
        <div className="comment-section">
          <h3>Comments</h3>
          <p className="text-sm text-gray-500">Comments Entity and Function is on Development</p>
        </div>
      </div>

      <div className="sidebar">
        <h2>추천 영상</h2>
          <VideoList/>
      </div>
    </div>
  );
};

export default VideoWatchPage;

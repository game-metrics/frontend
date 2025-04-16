import React, { useEffect, useState } from 'react';
import { fetchVideos } from '../../api/video/videoAPI';
import { Link } from 'react-router-dom';
import './css/VideoList.css';
import noThumbnail from '../../images/nothumnail.png';

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [currentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 4;

  useEffect(() => {
    loadVideos(currentPage);
  }, [currentPage]);

  const loadVideos = async (page) => {
    try {
      const { content, totalPages } = await fetchVideos(page, pageSize);
      setVideos(content);
      setTotalPages(totalPages);
      console.log(totalPages)
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  return (
    
    <><h1>Video List</h1>
    <div className="video-list-container">
      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={index} className="video-item">
              {/* Link로 감싸기 */}
              <Link to={`/watch/${video.id}`} className="video-link">
                <img
                  src={video.thumbNailUrl || noThumbnail}
                  alt={video.title}
                  style={{ width: '300px', height: '200px' }}
                />
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <p>{video.createdAt}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No videos available.</p>
        )}
      </div>
    </div>
    </>
  );
}

export default VideoList;

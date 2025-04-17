import React, { useEffect, useState } from 'react';
import { fetchVideos } from '../../api/video/videoAPI';
import './css/VideoList.css';
import noThumbnail from '../../images/nothumnail.png';
import { Link } from 'react-router-dom'; // ✅ Link import

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
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
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`page-button ${currentPage === i ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <h1>Video List</h1>
      <div className="video-list-container">
        <div className="video-grid">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <Link // ✅ Link 대신 사용
                key={index}
                to={`/watch/${video.id}`}
                className="video-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img
                  src={video.thumbNailUrl || noThumbnail}
                  alt={video.title}
                  style={{ width: '300px', height: '200px' }}
                />
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <p>{video.createdAt}</p>
              </Link>
            ))
          ) : (
            <p>No videos available.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Prev
            </button>
            {renderPagination()}
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <br />
    </>
  );
}

export default VideoList;

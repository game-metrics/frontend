import React, { useState, useEffect } from 'react';
import { fetchBroadcasts, fetchCategories } from '../../api/broadcast/BroadcastAPI';
import NavbarStream from './NavbarStream';
import { Link } from 'react-router-dom';
import noThumbnail from '../../images/nothumnail.png';

function StreamList() {
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [liveStream, setLiveStream] = useState(null); // ⭐ 라이브 방송 저장

  const PAGE_SIZE = 5;

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const broadcasts = await fetchBroadcasts(page, PAGE_SIZE);
        setData(broadcasts.content);
        setTotalPages(broadcasts.page?.totalPages || 1);

        // 실시간 방송 중 하나 찾아서 저장
        const live = broadcasts.content[0];
        setLiveStream(live || null);

      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategory = async () => {
      try {
          const categories = await fetchCategories();
          setListData(categories);
          localStorage.setItem("listData", JSON.stringify(categories));

      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    fetchCategory();
    fetchBroadcast();
  }, [page]);

  const getCategoryNameById = (id) => {
    const category = listData.data?.find((cat) => cat.id === id);
    return category ? category.category : "Unkown category";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <NavbarStream liveStream={liveStream} /> {/* live stream transfer */}
      <h1>Stream List</h1>
  
      <div className="data-list">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="data-item">
              <Link to={`/broadcast?id=${item.id}`}>
                <img
                  src={item.thumbNailUrl ? item.thumbNailUrl : noThumbnail}
                  alt={item.title}
                  style={{ width: '300px', height: '200px' }}
                />
                <h2>{item.title}</h2>
                <p>Category: {getCategoryNameById(item.categoryId)}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No broadcasts available</p>
        )}
      </div>
  
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              style={{
                margin: '0 5px',
                padding: '8px 12px',
                backgroundColor: i === page ? '#007bff' : '#f0f0f0',
                color: i === page ? '#fff' : '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default StreamList;

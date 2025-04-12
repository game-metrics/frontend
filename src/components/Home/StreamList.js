import React, { useState, useEffect } from 'react';
import { fetchBroadcasts, fetchCategories } from '../../api/broadcast/BroadcastAPI';
import { Link } from 'react-router-dom';
import noThumbnail from '../../images/nothumnail.png';

function StreamList() {
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

  const PAGE_SIZE = 4;

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const broadcasts = await fetchBroadcasts(page, PAGE_SIZE);
        setData(broadcasts.content);
        setTotalPages(broadcasts.totalPages); // 응답에서 totalPages도 받도록 수정
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategory = async () => {
      try {
        const cachedData = localStorage.getItem("listData");

        if (cachedData) {
          setListData(JSON.parse(cachedData));
        } else {
          const categories = await fetchCategories();
          setListData(categories);
          localStorage.setItem("listData", JSON.stringify(categories));
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    fetchCategory();
    fetchBroadcast();
  }, [page]); // 페이지가 바뀔 때마다 호출

  const getCategoryNameById = (id) => {
    const category = listData.data?.find((cat) => cat.id === id);
    return category ? category.category : "카테고리 알 수 없음";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
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

      {/* 페이지네이션 버튼 */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          이전
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {page + 1} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages}>
          다음
        </button>
      </div>
    </>
  );
}

export default StreamList;

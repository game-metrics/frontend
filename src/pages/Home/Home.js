import React, { useState, useEffect } from 'react';
import { fetchBroadcasts, fetchCategories } from '../../api/broadcast/BroadcastAPI';
import { Link } from 'react-router-dom';

import "./css/Home.css";

function Home() {
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const broadcasts = await fetchBroadcasts();
        setData(broadcasts);
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
          console.log("there is no category list");
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
  }, []);

  const getCategoryNameById = (id) => {
    const cachedData = localStorage.getItem("listData");
    if (cachedData) {
      const category = listData.data.find((cat) => cat.id === id);
      return category ? category.catagory : "카테고리 알 수 없음";
    }
    return "카테고리 알 수 없음";
  };

  return (
    <div className="home">
      <div className="data-list">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="data-item">
              {/* id를 query parameter로 전달 */}
              <Link to={`/broadcast?id=${item.id}`}>
                <img
                  src={item.thumbNailUrl}
                  alt={item.title}
                  style={{ width: '300px', height: '200px' }}
                />
                <h2>{item.title}</h2>
                <p>Category: {getCategoryNameById(item.catagoryId)}</p>
              </Link>
              <br />
            </div>
          ))
        ) : (
          <p>No broadcasts available</p>
        )}
      </div>
    </div>
  );
}

export default Home;

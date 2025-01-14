import React, { useState, useEffect } from 'react';
import { fetchBroadcasts, fetchCategories } from '../../api/broadcast/BroadcastAPI'; // api
import "./Home.css";

function Home() {
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const broadcasts = await fetchBroadcasts(); // Use the imported function
        setData(broadcasts);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategory = async () => {
      try {
        const cachedData = localStorage.getItem("listData");
    
        if (cachedData) {
          // Use cached data
          setListData(JSON.parse(cachedData));
        } else {
          // Fetch data if not already cached
          console.log("there is no category list");
          const categories = await fetchCategories(); // Use the imported function
          setListData(categories);
          localStorage.setItem("listData", JSON.stringify(categories)); // Cache the data
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    // Active fetching when component mounts
    fetchCategory();
    fetchBroadcast();
  }, []);

  // Get category name by id
  const getCategoryNameById = (id) => {
    const cachedData = localStorage.getItem("listData");
    if(cachedData){
      const category = listData.data.find((cat) => cat.id === id);
      return category ? category.catagory : "카테고리 알수 없음";
    }
    return "카테고리 알수 없음"
  };

  return (
    <div className="home">
      {/* Slidebar */}
      {/* following streamer stream */}

      <div className="data-list">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="data-item">
              <img
                src={item.thumbNailUrl}
                alt={item.title}
                style={{ width: '300px', height: '200px' }}
              />
              <h2>{item.title}</h2>
              <p>Category: {getCategoryNameById(item.catagoryId)}</p>
              <br />
            </div>
          ))
        ) : (
          <p>No broadcasts available</p>
        )}
      </div>

      {/* random videos */}
    </div>
  );
}

export default Home;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Home.css"
function Home() {

	const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);
  	
  useEffect(() => {

    const fetchBroadcast = async () => {
      try {
        const res = await axios.get('http://localhost:8080/broadcasts?page=0&size=3');
        setData(res.data.data.content);
        console.log(res.data.data.content);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCatagory = async () => {
      try {
        const cachedData = localStorage.getItem("listData");
    
        if (cachedData) {
          // Use cached data
          setListData(JSON.parse(cachedData));
           console.log("there is list"+ cachedData)
        } else {
          // Fetch data if not already cached
          console.log("there is no catasgory list")
          const res = await axios.get("http://localhost:8080/catagory");
          const data = res.data; // Axios automatically parses JSON responses
          setListData(data);
          localStorage.setItem("listData", JSON.stringify(data)); // Cache the data
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };
  
    // active
    fetchCatagory();
    fetchBroadcast();
  }, []);

  // getting catagory
  const getCategoryNameById = (id) => {
     const category = listData.find((cat) => cat.id === id);
    return category ? category.catagory : "카테고리 알수 없음";
  };

  return (
    <div class="home">
      {/* Slidebar */}
      {/* following streamer stream */}

      <div className="data-list">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="data-item">
              <img src={item.thumbNailUrl} alt={item.title} style={{ width: '300px', height: '200px' }} />
              <h2>{item.title}</h2>
              <p>Category: {getCategoryNameById(item.catagoryId)}</p>
              <br/>
            </div>
          ))
        ) : (
          <p>No broadcasts available</p>
        )}
      </div>

      {/* random videos */}
    </div>
  )
}

export default Home

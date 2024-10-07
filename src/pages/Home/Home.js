import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Home.css"
function Home() {

	const [data, setData] = useState([]);
  	
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/broadcasts?page=0&size=3');
        setData(res.data.data.content);
        console.log(res.data.data.content);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div class="home">
      {/* Slidebar */}
      {/* following streamer stream */}

      <div className="data-list">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="data-item">
              <h2>{item.title}</h2>
              <img src={item.thumbNailUrl} alt={item.title} style={{ width: '150px', height: '150px' }} />
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

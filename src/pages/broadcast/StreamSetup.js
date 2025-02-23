import { useState } from "react";
import {sendBroadcastData} from "../../api/broadcast/StreamAPI"

export default function BroadcastSetup() {
  const [title, setTitle] = useState("");
  const [thumbNailUrl, setThumbNailUrl] = useState("");
  const [categoryId, setCategoryId] = useState(1);

  const handleStartBroadcast = () => {
  const data = sendBroadcastData(title,thumbNailUrl,categoryId);
  console.log(data)
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>방송 시작하기</h2>

      {/* 방송 제목 입력 */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>방송 제목</label>
        <input
          type="text"
          placeholder="방송 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
      </div>

      {/* 썸네일 URL 입력 */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>썸네일 URL</label>
        <input
          type="text"
          placeholder="이미지 URL을 입력하세요"
          value={thumbNailUrl}
          onChange={(e) => setThumbNailUrl(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
      </div>

      {/* 썸네일 미리보기 */}
      {thumbNailUrl && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img src={thumbNailUrl} alt="썸네일 미리보기" style={{ maxWidth: "100%", height: "auto", borderRadius: "5px", border: "1px solid #ddd" }} />
        </div>
      )}

      {/* 카테고리 선택 */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>카테고리</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        >
          <option value="1">게임</option>
          <option value="2">음악</option>
          <option value="3">토크쇼</option>
        </select>
      </div>

      {/* 방송 시작 버튼 */}
      <button
        onClick={handleStartBroadcast}
        style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
      >
        방송 시작
      </button>
    </div>
  );
}

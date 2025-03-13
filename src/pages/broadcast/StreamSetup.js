import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendBroadcastData } from "../../api/broadcast/StreamAPI";

export default function BroadcastSetup() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [thumbNailUrl] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🔹 🔥 인증 확인 (토큰 없으면 홈으로 이동)
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (!token) {
      alert("인증 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImageToS3 = async () => {
    if (!file) {
      console.log("썸네일 없이 방송을 시작합니다.");
      return null;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/s3/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const data = await response.json();
      setIsUploading(false);
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      return null;
    }
  };

  const handleStartBroadcast = async () => {
    const uploadedImageUrl = await uploadImageToS3();

    try {
      const data = await sendBroadcastData(title, uploadedImageUrl, categoryId);

      if (data?.data?.id) {
        const broadcastId = data.data.id;
        navigate(`/stream?id=${broadcastId}`); // ✅ 🔥 useNavigate 사용
      } else {
        console.error("Broadcast ID not found in response:", data);
      }
    } catch (error) {
      console.error("Error starting broadcast:", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>방송 시작하기</h2>

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

      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>썸네일 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
      </div>

      {isUploading && <p style={{ textAlign: "center", color: "red" }}>이미지 업로드 중...</p>}

      {thumbNailUrl && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img src={thumbNailUrl} alt="썸네일 미리보기" style={{ maxWidth: "100%", height: "auto", borderRadius: "5px", border: "1px solid #ddd" }} />
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>카테고리</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        >
          <option value="1">게임</option>
          <option value="2">음악</option>
          <option value="3">토크쇼</option>
        </select>
      </div>

      <button
        onClick={handleStartBroadcast}
        disabled={isUploading}
        style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
      >
        {isUploading ? "업로드 중..." : "방송 시작"}
      </button>
    </div>
  );
}

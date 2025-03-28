import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendBroadcastData, uploadImageToS3 } from "../../api/broadcast/StreamAPI";

export default function BroadcastSetup() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🔹 🔥 Check authentication (redirect to home if no token)
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (!token) {
      alert("No authentication info found. Please log in again.");
      navigate("/");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStartBroadcast = async () => {
    if (!title) {
      alert("Please enter a broadcast title.");
      return;
    }
    
    let uploadedImageUrl = "";
    if (file) {
      setIsUploading(true);
      uploadedImageUrl = await uploadImageToS3(file);
      setIsUploading(false);
      if (!uploadedImageUrl) {
        alert("Failed to upload the thumbnail.");
        return;
      }
      setThumbnailUrl(uploadedImageUrl);
    }

    try {
      const data = await sendBroadcastData(title, uploadedImageUrl, categoryId);
      if (data.data?.id) {
        navigate(`/stream?id=${data.data.id}`);
      } else {
        console.error("Broadcast ID not found in response:", data);
      }
    } catch (error) {
      console.error("Error starting broadcast:", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Start Broadcast</h2>

      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Title</label>
        <input
          type="text"
          placeholder="Enter broadcast title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Upload Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
      </div>

      {isUploading && <p style={{ textAlign: "center", color: "red" }}>Uploading image...</p>}

      {thumbnailUrl && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img src={thumbnailUrl} alt="Thumbnail Preview" style={{ maxWidth: "100%", height: "auto", borderRadius: "5px", border: "1px solid #ddd" }} />
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
        >
          <option value="1">Gaming</option>
          <option value="2">Music</option>
          <option value="3">Talk Show</option>
        </select>
      </div>

      <button
        onClick={handleStartBroadcast}
        disabled={isUploading}
        style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
      >
        {isUploading ? "Uploading..." : "Start Broadcast"}
      </button>
    </div>
  );
}

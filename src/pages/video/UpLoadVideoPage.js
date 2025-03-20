import React, { useState, useEffect } from "react";
import { uploadVideo, uploadVideoS3 } from "../../api/video/videoAPI";

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Check if the user is authenticated when the component is mounted
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      alert("권한이 없습니다. 로그인해주세요.");
      window.location.href = "/";  // Redirect to the main page
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setMessage("비디오 파일을 선택해주세요.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("업로드 중...");

      // S3 upload
      const videoUpload = await uploadVideoS3({ file: videoFile });
      console.log(videoUpload);

      // Server upload - pass an empty string for thumbNailUrl
      const uploadResult = await uploadVideo({
        title: formData.title,
        thumbNailUrl: "",
        videoUrl: videoUpload,
      });

      setMessage("업로드 성공!");
      setFormData({ title: "", videoUrl: "" });
      setVideoFile(null);

      // Show alert and redirect to the main page
      alert("비디오 업로드가 완료되었습니다!");
      window.location.href = "/";  // Redirect to the main page

    } catch (error) {
      console.error(error);
      setMessage("업로드 실패. 콘솔을 확인해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default UploadVideo;

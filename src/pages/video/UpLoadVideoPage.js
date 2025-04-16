import React, { useState, useEffect } from "react";
import { uploadVideo, uploadVideoS3 } from "../../api/video/videoAPI";
import "./UploadVideo.css";

// 썸네일 추출 함수
const extractThumbnail = (file, seekTo = 5) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    video.onloadedmetadata = () => {
      const seekTime = Math.min(seekTo, video.duration);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const previewUrl = URL.createObjectURL(blob);
          resolve({ blob, previewUrl });
        },
        "image/jpeg",
        0.95
      );
    };

    video.onerror = (e) => {
      reject("썸네일 추출 실패", e);
    };
  });
};

const UploadVideo = () => {
  const [formData, setFormData] = useState({ title: "", videoUrl: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailBlob, setThumbnailBlob] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      alert("권한이 없습니다. 로그인해주세요.");
      window.location.href = "/";
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    setVideoFile(file);

    try {
      const { blob, previewUrl } = await extractThumbnail(file, 5);
      setThumbnailBlob(blob);
      setThumbnailPreviewUrl(previewUrl);
    } catch (error) {
      console.error(error);
      setMessage("썸네일 추출 실패");
    }
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

      const videoUrl = await uploadVideoS3({ file: videoFile });
      let thumbUrl = "";

      if (thumbnailBlob) {
        thumbUrl = await uploadVideoS3({ file: thumbnailBlob });
      }

      await uploadVideo({
        title: formData.title,
        thumbNailUrl: thumbUrl,
        videoUrl: videoUrl,
      });

      setMessage("업로드 성공!");
      setFormData({ title: "", videoUrl: "" });
      setVideoFile(null);
      setThumbnailBlob(null);
      setThumbnailPreviewUrl(null);

      alert("비디오 업로드가 완료되었습니다!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setMessage("업로드 실패. 콘솔을 확인해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-video-container">
      <h2 className="upload-video-title">Upload Video</h2>
      <form onSubmit={handleSubmit} className="upload-video-form">
        <div className="upload-video-field">
          <label className="upload-video-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="upload-video-input"
            required
          />
        </div>

        <div className="upload-video-field">
          <label className="upload-video-label">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="upload-video-input"
            required
          />
        </div>

        {thumbnailPreviewUrl && (
          <div className="upload-video-thumbnail-preview">
            <label className="upload-video-label">Thumbnail Preview</label>
            <img
              src={thumbnailPreviewUrl}
              alt="Thumbnail Preview"
              className="upload-video-thumbnail-img"
            />
          </div>
        )}

        <button
          type="submit"
          className="upload-video-button"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && <p className="upload-video-message">{message}</p>}
    </div>
  );
};

export default UploadVideo;

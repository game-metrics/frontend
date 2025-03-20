import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// 토큰 가져오기기
const getAuthHeader = () => {
  const token = localStorage.getItem("auth");
  return token ? { Authorization: token } : {};
};

// 비디오 리스트트
export const fetchVideos = async (page = 0, size = 4) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos?page=${page}&size=${size}`);
    const data = response.data.data;
    return {
      content: data?.content || [],
      totalPages: data?.totalPages || 0,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return {
      content: [],
      totalPages: 0,
    };
  }
};

// 📦 [GET] Fetch a single video by ID
export const fetchVideoById = async (videoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching video with ID ${videoId}:`, error);
    return null;
  }
};

// 📥 [POST] 영상 비디오 파일 S3 업로드
export const uploadVideoS3 = async ({ file }) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 백엔드에서 "file" 로 받는 경우

    const response = await axios.post(
      `${API_BASE_URL}/s3/video`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data.url);
    return response.data.url; // videoUrl 반환
  } catch (error) {
    console.error("Error uploading video to S3:", error);
    throw error;
  }
};

// 📦 [POST] 최종 서버 등록 (title + s3 url들)
export const uploadVideo = async ({ title, thumbNailUrl, videoUrl }) => {
  try {
    console.log(videoUrl);
    const response = await axios.post(
      `${API_BASE_URL}/videos`,
      { title, thumbNailUrl, videoUrl},
      { headers: getAuthHeader() }
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error uploading video to DB:', error);
    throw error;
  }
};
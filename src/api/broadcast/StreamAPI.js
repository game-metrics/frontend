import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * S3에 이미지 업로드
 * @param {File} file - 업로드할 파일 객체
 * @returns {Promise<string | null>} 업로드된 이미지 URL 반환 (실패 시 null)
 */
export const uploadImageToS3 = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/s3/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("이미지 업로드 성공:", response.data);
    return response.data.url; // ✅ 업로드된 이미지 URL 반환
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    return null;
  }
};

/**
 * 방송 데이터 전송 (썸네일 업로드 포함)
 * @param {string} title - 방송 제목
 * @param {File | null} file - 업로드할 썸네일 파일 (옵션)
 * @param {number} categoryId - 방송 카테고리 ID
 * @returns {Promise<object>} 방송 시작 응답 데이터 반환
 */
export const sendBroadcastData = async (title, file, categoryId) => {
  const token = localStorage.getItem("auth");
  if (!token) throw new Error("No auth token");

  let thumbNailUrl = null;

  if (file) {
    console.log("이미지 업로드 시작...");
    thumbNailUrl = await uploadImageToS3(file);
    console.log("업로드된 썸네일 URL:", thumbNailUrl);
  } else {
    console.log("썸네일 없이 방송을 시작합니다.");
  }

  const broadcastData = {
    title,
    thumbNailUrl,
    categoryId,
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/broadcasts`, broadcastData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    console.log("방송 시작 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("방송 시작 실패:", error);
    throw error;
  }
};

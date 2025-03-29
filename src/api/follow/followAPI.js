import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL +`/follow`; // 백엔드 API 주소

// 팔로우 목록 가져오기 (페이지네이션 지원)
export const getFollowList = async (page = 0, size = 10) => {
  try {
    const token = localStorage.getItem("auth"); // JWT 토큰 가져오기
    const response = await axios.get(`${API_BASE_URL}?page=${page}&size=${size}`, {
      headers: {
        Authorization: `${token}`, // 인증 헤더 추가
      },
    });
    return response.data; // Page 객체 전체 반환
  } catch (error) {
    console.error("Error fetching follow list:", error);
    throw error;
  }
};

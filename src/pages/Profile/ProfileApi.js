import axios from "axios";

const backendBase = process.env.REACT_APP_BACKEND_URL;

// 쿠키에서 인증 토큰 가져오기
const getAuthToken = () => {
  const cookies = document.cookie.split("; ");
  const authCookie = cookies.find(row => row.startsWith("auth="));
  return authCookie ? authCookie.split("=")[1] : null;
};

// 프로필 가져오기
export const fetchProfile = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token");

  const response = await axios.get(`${backendBase}/users/profile`, {
    headers: { Authorization: `${token}` },
  });
  return response.data.data;
};

// 비밀번호 변경 요청
export const changePassword = async (currentPassword, newPassword) => {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token");

  const response = await axios.patch(
    `${backendBase}/users`,
    { currentPassword, newPassword },
    { headers: { Authorization: `${token}` } }
  );
  return response.data;
};

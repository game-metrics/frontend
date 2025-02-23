import axios from "axios";

const backendBase = process.env.REACT_APP_BACKEND_URL;

// 프로필 가져오기
export const fetchProfile = async () => {
  const token = localStorage.getItem("auth"); // 로컬스토리지에서 'auth' 가져오기
  if (!token) throw new Error("No auth token");

  const response = await axios.get(`${backendBase}/users/profile`, {
    headers: { Authorization: `${token}` },
  });
  return response.data.data;
};

// 비밀번호 변경 요청
export const changePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem("auth"); // 로컬스토리지에서 'auth' 가져오기
  if (!token) throw new Error("No auth token");

  const response = await axios.patch(
    `${backendBase}/users`,
    { currentPassword, newPassword },
    { headers: { Authorization: `${token}` } }
  );
  return response.data;
};

import axios from "axios";

const backendBase = process.env.REACT_APP_BACKEND_URL;

// 프로필 가져오기
export const fetchProfile = async () => {
  const token = localStorage.getItem("auth"); // 로컬스토리지에서 'auth' 가져오기
  if (!token) throw new Error("No auth token");

  const response = await axios.get(`${backendBase}/users`, {
    headers: { Authorization: `${token}` },
  });
  console.log( response.data.data);
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
// 프로필 이미지 S3 업로드
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  const token = localStorage.getItem("auth"); // 로컬스토리지에서 'auth' 가져오기
  if (!token) throw new Error("No auth token");
  formData.append("file", file);

  const res = await axios.post(`${backendBase}/s3/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `${token}` 
    },
  });

  return res.data.url; // 업로드된 이미지 URL
};

// 업로드된 이미지로 프로필 이미지 변경
export const updateProfileImage = async (imageUrl) => {
  const token = localStorage.getItem("auth"); // 로컬스토리지에서 'auth' 가져오기
  if (!token) throw new Error("No auth token");
  const res = await axios.patch(
    `${backendBase}/users/profile/image`,
    { profileImageUrl: imageUrl },
    {
      headers: { Authorization: `${token}`  },
    }
  );
  return res;
};
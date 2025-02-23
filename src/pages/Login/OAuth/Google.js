import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../../../api/auth/authAPI";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code) {
      // spring 으로 전송
      loginWithGoogle(code)
        .then((response) => {
          console.log("로그인 성공!" + response.data.data);
          // nickname을 localStorage에 저장
          localStorage.setItem("nickname", response.data.data.nickname);
          localStorage.setItem("auth", response.data.data.token); // 토큰도 localStorage에 저장
          navigate("/sign-in");
          window.location.reload();
        })
        .catch((error) => {
          console.error("로그인 중 오류 발생:", error);
          alert("로그인 실패!");
          navigate("/sign-in");
          window.location.reload();
        });
    } else {
      console.error("Authorization Code not found");
      navigate("/"); // Redirect to home page if no code is present
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default GoogleCallback;

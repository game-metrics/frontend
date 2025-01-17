import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from '../../../api/auth/authApi';

const GoogleCallback = () => {
  const navigate = useNavigate();

  // Set a cookie with secure options
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Lax`;
    console.log(`Cookie set: ${name}=${value}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code) {
      // spring 으로 전송
      loginWithGoogle(code).then((response) => {
          alert("로그인 성공!"+response.data.data);
          setCookie("auth", response.data.data, 1);
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

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {loginWithKakao} from '../../../api/auth/authAPI';

const KakaoCallback = () => {
  const navigate = useNavigate();

    // Set a cookie with expiration 쿠키 만들기기
    const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    if (code) {
      loginWithKakao(code)
        .then((token) => {
          alert(`로그인 성공!`);
          setCookie("auth", token, 1); // Set auth cookie
          navigate('/sign-in');
          window.location.reload();
        })
        .catch((error) => {
          console.error('로그인 중 오류 발생:', error);
          alert('로그인 실패!');
          navigate('/sign-in');
        });
    } else {
      console.error('Authorization Code not found');
      navigate('/'); // `code`가 없으면 초기 페이지로 이동
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default KakaoCallback;

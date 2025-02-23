import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithKakao } from '../../../api/auth/authAPI';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    if (code) {
      loginWithKakao(code)
        .then((data) => {
          console.log(`로그인 성공!`);
          // nickname을 localStorage에 저장
          localStorage.setItem("auth", data.token); // 토큰을 localStorage에 저장
          localStorage.setItem("nickname", data.nickname); // nickname을 localStorage에 저장
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

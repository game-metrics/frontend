import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../images/logo1.png";
import SearchIcon from "@mui/icons-material/Search";

function Header() {
  const [logoError, setLogoError] = useState(false); // 로고 이미지 로딩 오류 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부 상태
  const [nickname, setNickname] = useState(""); // 사용자 닉네임 상태

  // 쿠키에서 특정 이름의 값을 가져오는 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const token = getCookie("auth"); // 'auth' 쿠키 값 가져오기 (로그인 확인용)
    const userNickname = getCookie("nickname"); // 'nickname' 쿠키 값 가져오기

    console.log("쿠키 토큰:", token); // 디버깅: auth 토큰 값 확인
    console.log("닉네임:", userNickname); // 디버깅: nickname 값 확인

    setIsAuthenticated(Boolean(token)); // auth 토큰이 존재하면 로그인 상태로 설정
    if (userNickname) {
      setNickname(userNickname); // 닉네임 값이 존재하면 상태 업데이트
    }
  }, []);

  // 이미지 로딩 실패 시 실행되는 함수
  const handleImageError = () => {
    setLogoError(true); // 로고 이미지 오류 상태로 변경
  };

  // 로그아웃 기능
  const handleLogout = () => {
    console.log("로그아웃 중..."); // 디버깅: 로그아웃 실행 확인
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // auth 쿠키 삭제
    document.cookie = "nickname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // nickname 쿠키 삭제

    setIsAuthenticated(false); // 로그인 상태 변경
    setNickname(""); // 닉네임 상태 초기화
    alert("로그아웃되었습니다."); // 사용자에게 로그아웃 알림
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <div className="header">
      {!logoError ? (
        <a href="/">
          <img
            className="header__logo"
            src={logo}
            alt="GameMetric 로고"
            onError={handleImageError}
          />
        </a>
      ) : (
        <span className="header__logoError">이미지가 없습니다</span>
      )}

      <div className="header__search">
        <input className="header__searchInput" type="text" id="search" />
        <SearchIcon className="header__searchIcon" />
      </div>

      <div className="header__nav">
        {!isAuthenticated ? (
          <a href="/sign-in">
            <div className="header__option">
              <span className="header__optionLineOne">Hello</span>
              <span className="header__optionLineTwo">Sign In</span>
            </div>
          </a>
        ) : (
          <div
            className="header__option"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <span className="header__optionLineOne">
              {nickname ? `안녕하세요, ${nickname}` : "Hello"}
            </span>
            <span className="header__optionLineTwo">Log Out</span>
          </div>
        )}

        <a href="/broadcast-setup">
          <div className="header__option">
            <span className="header__optionLineOne">Start</span>
            <span className="header__optionLineTwo">BroadCast</span>
          </div>
        </a>

        <a href="/profile">
          <div className="header__option">
            <span className="header__optionLineOne">Your</span>
            <span className="header__optionLineTwo">Profile</span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default Header;

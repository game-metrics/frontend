import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nickname, setNickname] = useState("");

  // localStorage에서 초기 상태 로드
  useEffect(() => {
    const token = localStorage.getItem("auth");
    const userNickname = localStorage.getItem("nickname");
    setIsAuthenticated(Boolean(token));
    if (userNickname) setNickname(userNickname);
  }, []);

  // 로그인 함수 (SignIn에서 사용)
  const login = (token, nickname) => {
    localStorage.setItem("auth", token);
    localStorage.setItem("nickname", nickname);
    setIsAuthenticated(true);
    setNickname(nickname);
  };

  // 로그아웃 함수 (Header에서 사용)
  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("nickname");
    setIsAuthenticated(false);
    setNickname("");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        nickname,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
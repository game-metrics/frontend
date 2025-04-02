const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchUsers = async (query) => {
    const url = `${API_BASE_URL}/users/search?name=${query}&page=0&size=3`;
    console.log("🔍 유저 검색 요청 URL:", url); // 추가
    const response = await fetch(url);
    const data = await response.json();
    console.log("✅ 유저 검색 응답:", data); // 추가
    return data;
};

export const fetchBroadcasts = async (query) => {
    const url = `${API_BASE_URL}/broadcasts/search?title=${query}&page=0&size=3`;
    console.log("🔍 방송 검색 요청 URL:", url); // 추가
    const response = await fetch(url);
    const data = await response.json();
    console.log("✅ 방송 검색 응답:", data); // 추가
    return data;
};

export const fetchVideos = async (query) => {
    const url = `${API_BASE_URL}/videos/search?videoTitle=${query}&page=0&size=3`;
    console.log("🔍 비디오 검색 요청 URL:", url); // 추가
    const response = await fetch(url);
    const data = await response.json();
    console.log("✅ 비디오 검색 응답:", data); // 추가
    return data;
};


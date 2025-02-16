// CSS
import './App.css';
// dependency
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 컴포넌트
import Header from './component/Header/Header';
import CustomSidebar from './component/Sidebar/CustomSidebar';

// 페이지 
import Home from "./pages/Home/Home"
import SignIn from "./pages/Login/SignIn"
import KakaoCallback from "./pages/Login/OAuth/Kakao"
import GoogleCallback from "./pages/Login/OAuth/Google"
import Profile from './pages/Profile/Profile';
import SignUp from './pages/Login/SignUp';
import BroadCast from './pages/broadcast/Broadcast';
import Stream from './pages/broadcast/StreamPage';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content-container" style={{ display: 'flex' }}>
        <CustomSidebar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/broadcast" element={<BroadCast />} />
            <Route path="/stream" element={<Stream />} /> 
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-in/kakao" element={<KakaoCallback />} />
            <Route path="/sign-in/google" element={<GoogleCallback />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
export default App;

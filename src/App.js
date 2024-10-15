// CSS
import './App.css';
// dependency
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 컴포넌트
import Header from './component/Header/Header';
import CustomSidebar from './component/Sidebar/CustomSidebar';

// 페이지 
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Profile from './pages/Profile/Profile';

function App() {
  return (
<div className="App">
      <Header />
      <div className="content-container">
      <CustomSidebar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
      </div>
</div>
  );
}
export default App;

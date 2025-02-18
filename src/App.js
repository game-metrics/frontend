import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

// 컴포넌트
import Header from "./components/Header/Header";
import CustomSidebar from "./components/Sidebar/CustomSidebar";
// 라우트 목록
import routes from "./routes/routes";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router> {/* ✅ 최상위에서 Router 감싸기 */}
      <div className="App">
        <Header toggleSidebar={toggleSidebar} /> {/* ✅ 상태 전달 */}
        <div className="content-container" style={{ display: "flex" }}>
          <CustomSidebar isSidebarOpen={isSidebarOpen} /> {/* ✅ 상태 전달 */}
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

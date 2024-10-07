import './App.css';
//import { BrowserRouter as Router, Routes, Switch } from "react-router-dom";
import Header from './component/Header/Header';
import CustomSidebar from './component/Sidebar/CustomSidebar';
import Home from "./pages/Home/Home"

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content-container">
      <CustomSidebar />
      <Home />
      </div>
    </div>
  );
}
export default App;

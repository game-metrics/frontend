import './App.css';
//import { BrowserRouter as Router, Routes, Switch } from "react-router-dom";
import Header from './component/Header/Header';
import CustomSidebar from './component/Sidebar/CustomSidebar';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content-container">
      <CustomSidebar />
      {/* Home */}
      <h1>
        Hello clever programmers
      </h1>
      </div>
    </div>
  );
}
export default App;

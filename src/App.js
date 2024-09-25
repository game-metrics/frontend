import './App.css';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './component/Header/Header';
import Sidebar from './component/Sidebar/Sidebar';

function App() {
  return (
    <div className="App">
      <Header />
      <h1>
        hello clever programmers
      </h1>
      <Sidebar />
      {/* Home */}
    </div>
  );
}
export default App;

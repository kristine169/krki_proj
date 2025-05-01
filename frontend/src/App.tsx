import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import PracticeView from "./components/PracticeView";
import ProgressView from "./components/ProgressView";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticeView />} />
        <Route path="/progress" element={<ProgressView />} />
      </Routes>
    </div>
  );
}

export default App;

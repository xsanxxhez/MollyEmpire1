import { Routes, Route } from "react-router-dom";
import Tabs from "./components/Tabs";
import Main from "./pages/Main";
import Referrals from "./pages/Referrals";
import Bonus from "./pages/Bonus";
import Settings from "./pages/Settings";
import Progress from "./pages/Progress";
import "./App.css";

const App = () => {
  return (
    <div className="app-wrapper">
      <div className="game-container">
        <Tabs />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/bonus" element={<Bonus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/referrals" element={<Referrals />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

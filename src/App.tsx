import React from "react";
import { Routes, Route } from "react-router-dom";
import Tabs from "./components/Tabs";
import Main from "./pages/Main";
import Referrals from "./pages/Referrals";
import Bonus from "./pages/Bonus";
import Settings from "./pages/Settings";
import Progress from "./pages/Progress";

const App = () => {
  return (
    <div className="app-wrapper">
      <Tabs />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/progress" element={<Progress />} />

          <Route path="/referrals" element={<Referrals />} />
          <Route path="/bonus" element={<Bonus />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

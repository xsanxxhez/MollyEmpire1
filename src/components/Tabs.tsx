import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Tabs.css"

const Tabs: React.FC = () => {
  return (
    <div className="tabs-container">
      <NavLink to="/" end className="tab-link">🏠</NavLink>
      <NavLink to="/progress" className="tab-link">📈</NavLink>
      <NavLink to="/referrals" className="tab-link">👥</NavLink>
      <NavLink to="/bonus" className="tab-link">🎁</NavLink>
      <NavLink to="/settings" className="tab-link">⚙️</NavLink>
    </div>
  );
};

export default Tabs;
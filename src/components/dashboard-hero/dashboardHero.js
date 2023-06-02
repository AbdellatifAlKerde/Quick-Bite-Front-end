import React from "react";
import "./dashboardHero.css";

function DashboardHero(props) {
  return (
    <div className="dashboard-hero">
      <img src={props.image} alt={props.alt} style={props.style} />
      <h2>{props.title}</h2>
    </div>
  );
}

export default DashboardHero;

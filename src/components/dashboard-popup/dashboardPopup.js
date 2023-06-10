import React from "react";
import "./dashboardPopup.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function DashboardPopup(props) {
  return (
    <>
      <div
        className="dashboard-popup-overlay"
        onClick={props.onClickClose}
      ></div>
      <div className="dashboard-popup-body">
        <div className="dashboard-popup-title">
          <h2>{props.title}</h2>
        </div>
        <div className="dashboard-popup-close" onClick={props.onClick}>
          <CloseRoundedIcon />
        </div>
        <form onSubmit={props.onSubmit} className="dashboard-popup-form">
          {props.children}
        </form>
      </div>
    </>
  );
}

export default DashboardPopup;

import React from "react";
import OwnerHeader from "../../components/owner-header/ownerHeader";
import { Outlet } from "react-router-dom";
import OwnerDashboardSidebar from "../../components/owner-dashboard-sidebar/ownerDashboardSidebar";
import "./restoOwnerDashboard.css";

function RestoOwnerDashboard() {
  return (
    <div className="owner-dashboard">
      <OwnerHeader />
      <div className="owner-dashboard-container">
        <OwnerDashboardSidebar />
        <div className="owner-dashboard-pages">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default RestoOwnerDashboard;

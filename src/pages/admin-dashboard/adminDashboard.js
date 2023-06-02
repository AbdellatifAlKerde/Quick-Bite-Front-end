import React from "react";
import { Outlet } from "react-router-dom";
import AdminDashboardSidebar from "../../components/adminDashboardSidebar/adminDashboardSidebar";
import "./adminDashboard.css";

function AdminDashboard() {
  return (
    <div className="owner-dashboard">
      <div className="owner-dashboard-container">
        <AdminDashboardSidebar />
        <div className="owner-dashboard-pages">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoutes() {
  const isSuper = Cookies.get("isSuper");
  const isAuthenticated = Cookies.get("admin-token");
  return isAuthenticated && isSuper ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized-a" />
  );
}

export default PrivateRoutes;

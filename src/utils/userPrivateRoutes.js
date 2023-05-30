import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function UserPrivateRoutes() {
  const isAuthenticated = Cookies.get("user-token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/unauthorized-u" />;
}

export default UserPrivateRoutes;

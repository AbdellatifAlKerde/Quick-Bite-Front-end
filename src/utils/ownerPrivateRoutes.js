import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function OwnerPrivateRoutes() {
  const isOwner = Cookies.get("isOwner");
  const isAuthenticated = Cookies.get("admin-token");
  return isAuthenticated && isOwner ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized-a" />
  );
}

export default OwnerPrivateRoutes;

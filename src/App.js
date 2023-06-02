import "./App.css";
import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/home-page/homePage";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import UserLoginPage from "./pages/user-login-page/userLoginPage";
import ProductsPage from "./pages/products-page/productsPage";
import { ProductDataProvider } from "./components/product-data-provider/productDataProvider";
import AdminLoginPage from "./pages/admin-login-page/adminLoginPage";
import AdminDashboard from "./pages/admin-dashboard/adminDashboard";
import RestoOwnerDashboard from "./pages/resto-owner-dashboard/restoOwnerDashboard";
import Unauthorized from "./pages/unauthorized/unauthorized";
import PrivateRoutes from "./utils/privateRoutes";
import OwnerPrivateRoutes from "./utils/ownerPrivateRoutes";
import RestaurantPage from "./pages/restaurants-page/restaurantPage";
import RestaurantDetails from "./pages/restaurant-details/restaurantDetails";
import NotFoundPage from "./pages/not-found-page/notFoundPage";
import OwnerRegister from "./pages/owner-register/ownerRegister";
import logo from "./assets/images/QUICK BITE LOGO.svg";
import UserProfile from "./pages/user-profile/userProfile";
import UserPrivateRoutes from "./utils/userPrivateRoutes";
import OwnerDashboardHome from "./pages/owner-dashboard-home/ownerDashboardHome";
import OwnerDashboardProducts from "./pages/owner-dashboard-products/ownerDashboardProducts";
import OwnerDashboardOrders from "./pages/owner-dashboard-orders/ownerDashboardOrders";
import ScrollToTop from "./components/scroll-to-top/scrollToTop";
import AdminDashboardOwners from "./pages/admin-dashboard-owners/adminDashboardOwners";
import AdminDashboardRestaurants from "./pages/admin-dashboard-restaurants/adminDashboardRestaurants";
import AdminDashboardCategories from "./pages/admin-dashboard-categories/adminDashboardCategories";

function App() {
  const location = useLocation();
  const isUserLoginPath = location.pathname === "/user-login";
  const isAdminLoginPath = location.pathname === "/admin-login";
  const isProductPath = location.pathname === "/products";
  const isAdminDashboardPath = location.pathname.startsWith("/admin");
  const isOwnerDashboardPath = location.pathname === "/owner-dashboard";
  const isDashboardPath = isAdminDashboardPath || isOwnerDashboardPath;
  const isRestaurantPath = location.pathname === "/restaurants";
  const isRestaurantDetailsPath = location.pathname.startsWith("/restaurant");
  const isOwnerRegisterPath = location.pathname.startsWith("/owner");

  const isProductUserLoginPath =
    isUserLoginPath ||
    isProductPath ||
    isAdminLoginPath ||
    isDashboardPath ||
    isRestaurantPath ||
    isRestaurantDetailsPath ||
    isOwnerRegisterPath;
  const isUserAdminLoginPath =
    isUserLoginPath ||
    isAdminLoginPath ||
    isDashboardPath ||
    isOwnerRegisterPath;
  return (
    <ProductDataProvider>
      <div className="App">
        {!isProductUserLoginPath && <Header logo={logo} />}
        <ScrollToTop />
        <Routes>
          <Route>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/user-login" element={<UserLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/restaurants" element={<RestaurantPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/owner-register" element={<OwnerRegister />} />
            <Route path="/*" element={<NotFoundPage />} />
            <Route
              path="/unauthorized-a"
              element={<Unauthorized to="/admin-login" />}
            />
            <Route
              path="/unauthorized-u"
              element={<Unauthorized to="/user-login" />}
            />
          </Route>
          <Route path="/" element={<PrivateRoutes />}>
            <Route path="/" element={<AdminDashboard />}>
              <Route
                path="/admin-dashboard"
                element={<AdminDashboardOwners />}
              />
              <Route
                path="/admin-restaurants"
                element={<AdminDashboardRestaurants />}
              />
              <Route
                path="/admin-categories"
                element={<AdminDashboardCategories />}
              />
            </Route>
          </Route>
          <Route path="/" element={<OwnerPrivateRoutes />}>
            <Route path="/" element={<RestoOwnerDashboard />}>
              <Route path="/owner-dashboard" element={<OwnerDashboardHome />} />
              <Route
                path="/owner-products"
                element={<OwnerDashboardProducts />}
              />
              <Route path="/owner-orders" element={<OwnerDashboardOrders />} />
            </Route>
          </Route>
          <Route path="/" element={<UserPrivateRoutes />}>
            <Route path="/user-profile" element={<UserProfile />} />
          </Route>
        </Routes>
        {!isUserAdminLoginPath && <Footer />}
      </div>
    </ProductDataProvider>
  );
}

export default App;

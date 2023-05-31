import React from "react";
import "./header.css";
import { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import MainButton from "../main-button/MainButton";
import { useNavigate } from "react-router-dom";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import Cookies from "js-cookie";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import profileImage from "../../assets/images/profile-icon.jpeg";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import AccountRoundedIcon from "@mui/icons-material/AccountCircle";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Tooltip } from "@mui/material";

function Header(props) {
  const { cartItems, user, owner } = useContext(ProductDataContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [userProfileDropdown, setUserProfileDropdown] = useState(false);
  const isAuthenticated = Cookies.get("user-token");
  const isOwnerAuthenticated = Cookies.get("admin-token");
  const isOwner = Cookies.get("isOwner");

  const handleDropdownClose = () => {
    if (userProfileDropdown) {
      setUserProfileDropdown(false);
    } else {
      setUserProfileDropdown(true);
    }
  };

  const logout = () => {
    localStorage.setItem("user", "");
    Cookies.remove("user-token");
    navigate("/");
  };

  const close = () => {
    document.querySelector(".cart-container").classList.toggle("close");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (scrollPosition > 400) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let activeStyle = {
    textDecoration: "underline",
  };

  return (
    <header className={`main-header ${isScrolled ? "bg-color" : ""}`}>
      <div className="main-header-logo" onClick={() => navigate("/")}>
        <img src={props.logo} alt="quick bite logo" />
      </div>

      <nav className="header-navigation">
        <NavLink
          to="/products"
          className="main-header-navigation-links"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Products
        </NavLink>
        <NavLink
          to="/restaurants"
          className="main-header-navigation-links"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Restaurants
        </NavLink>
        {isAuthenticated ? (
          <div className="header-user-profile" onClick={handleDropdownClose}>
            <img src={profileImage} alt="Profile image" />
            <div
              className={`header-user-prfile-dropdown ${
                userProfileDropdown ? "close" : ""
              }`}
            >
              <Link
                to="/user-profile"
                onClick={() => setUserProfileDropdown(false)}
              >
                <span>
                  <AccountRoundedIcon />
                </span>
                Profile
              </Link>
              <Link
                to="/"
                onClick={() => {
                  setUserProfileDropdown(false);
                  logout();
                }}
              >
                <span>
                  <LogoutRoundedIcon />
                </span>
                Logout
              </Link>
            </div>
          </div>
        ) : (
          <Link to="/user-login">
            <MainButton name="Login" className="header-navigation-login" />
          </Link>
        )}
        {isOwnerAuthenticated && isOwner ? (
          <Tooltip title={`${owner.username}'s Dashboard`} placement="bottom">
            <div
              className="header-user-profile"
              onClick={() => navigate("/owner-dashboard")}
            >
              <DashboardRoundedIcon
                style={{ scale: "1.2", display: "block" }}
              />
            </div>
          </Tooltip>
        ) : (
          <Link to="/owner-register">
            <MainButton
              name="Become a Partner"
              className="header-navigation-login"
            />
          </Link>
        )}

        <div className="product-header-add-to-cart" onClick={close}>
          <ShoppingCartRoundedIcon style={{ transform: "scale(1.3)" }} />
          {cartItems.length > 0 && (
            <div className="product-header-add-to-cart-notif"></div>
          )}
        </div>
      </nav>
      {!navOpen ? (
        <div
          className="mobile-header-navigation"
          onClick={() => setNavOpen(true)}
        >
          <MenuRoundedIcon />
        </div>
      ) : (
        <div
          className="mobile-header-navigation"
          onClick={() => setNavOpen(false)}
        >
          <CloseRoundedIcon />
        </div>
      )}
      <div
        className={`mobile-navigation-dopdown-overlay ${
          !navOpen ? "open" : ""
        }`}
        onClick={() => setNavOpen(false)}
      >
        <div className={`mobile-navigation-dropdown ${!navOpen ? "open" : ""}`}>
          {isAuthenticated ? (
            <div
              className="header-user-profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div onClick={() => navigate("/user-profile")}>
                <div style={{ width: "48px" }}>
                  <img src={profileImage} alt="Profile image" />
                </div>
                <span style={{ fontSize: "1.2rem", textAlign: "start" }}>
                  {user && user.username}
                  <br></br>
                  {user && user.email}
                </span>
              </div>
              <div
                style={{ color: "var(--accent-color)" }}
                onClick={() => logout()}
              >
                <LogoutRoundedIcon />
              </div>
            </div>
          ) : (
            <Link to="/user-login">
              <MainButton
                name="Login"
                className="header-navigation-login"
                style={{ width: "100%" }}
              />
            </Link>
          )}
          <div
            className="product-header-add-to-cart"
            onClick={close}
            style={{ justifyContent: "flex-start" }}
          >
            <ShoppingCartRoundedIcon style={{ transform: "scale(1.3)" }} />
            <span
              style={{
                fontSize: "1.2rem",
                marginLeft: "1rem",
              }}
            >
              My Cart
            </span>
          </div>
          <NavLink
            to="/products"
            className="main-header-navigation-links mobile-grid-centering"
          >
            <span className="mobile-icon">
              <ShoppingBagRoundedIcon />
            </span>
            <span>Products</span>
          </NavLink>
          <NavLink
            to="/restaurants"
            className="main-header-navigation-links mobile-grid-centering"
          >
            <span className="mobile-icon">
              <RestaurantRoundedIcon />
            </span>
            <span>Restaurants</span>
          </NavLink>

          {isOwnerAuthenticated && isOwner ? (
            <div
              className="header-owner-profile mobile-grid-centering"
              onClick={() => navigate("/owner-dashboard")}
            >
              <span className="mobile-icon">
                <DashboardRoundedIcon />
              </span>
              <span style={{ textTransform: "capitalize" }}>
                {owner.username}'s Dashboard
              </span>
            </div>
          ) : (
            <Link to="/owner-register">
              <MainButton
                name="Become a Partner"
                className="header-navigation-login"
                style={{ width: "100%" }}
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

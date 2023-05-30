import React from "react";
import "./ownerHeader.css";
import logo from "../../assets/images/LOGO (1).svg";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MainButton from "../main-button/MainButton";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

function OwnerHeader() {
  const navigate = useNavigate();
  const isOwnerAuthenticated = Cookies.get("admin-token");
  const isOwner = Cookies.get("isOwner");

  return (
    <header className="owner-register-header">
      <div className="owner-register-header-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="quick bite logo" />
      </div>
      <nav className="owner-register-header-navigation">
        {isOwnerAuthenticated && isOwner ? (
          <MainButton
            name="Logout"
            style={{
              paddingBlock: ".7rem",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              Cookies.remove("admin-token");
              Cookies.remove("isSuper");
              navigate("/");
            }}
          >
            <span style={{ marginLeft: ".5rem" }}>
              <LogoutRoundedIcon />
            </span>
          </MainButton>
        ) : (
          <MainButton
            name="Login"
            style={{
              paddingBlock: ".7rem",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => navigate("/admin-login")}
          >
            <span style={{ marginLeft: ".5rem" }}>
              <PersonRoundedIcon />
            </span>
          </MainButton>
        )}
      </nav>
    </header>
  );
}

export default OwnerHeader;

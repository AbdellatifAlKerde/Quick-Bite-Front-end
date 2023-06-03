import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminLoginPage.css";
import TextField from "../../components/text-field/TextField";
import MainButton from "../../components/main-button/MainButton";
import Spinner from "../../components/spinner/spinner";
import axios from "axios";
import Cookies from "js-cookie";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [adminLogin, setAdminLogin] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showLogoutBtn, setShowLogoutBtn] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLoginChange = (event) => {
    const value = event.target.value;
    setAdminLogin({ ...adminLogin, [event.target.name]: value });
  };

  const login = async (e) => {
    e.preventDefault();
    const adminForm = {
      username: adminLogin.username,
      password: adminLogin.password,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/login`,
        adminForm
      );
      // console.log(response);
      const tokenExists = Cookies.get("admin-token");
      if (!tokenExists) {
        if (response.data.isActive) {
          if (response.status === 200) {
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            Cookies.set("admin-token", response.data.token, {
              expires: oneWeek,
            });
          }
          if (response.data.isSuper) {
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            Cookies.set("isSuper", response.data.isSuper, { expires: oneWeek });
            localStorage.setItem("admin", JSON.stringify(response.data));
            navigate("/admin-dashboard");
          } else {
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            Cookies.set("isOwner", response.data.isSuper, { expires: oneWeek });
            localStorage.setItem("owner", JSON.stringify(response.data));
            navigate("/owner-dashboard");
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setError("Account is not active, please activate your account");
        }
      } else {
        setError("Can't login with both admin and owner.");
        setIsLoading(false);
        setShowLogoutBtn(true);
      }
    } catch (e) {
      console.log(e);
      setError(e.response.data.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-back-btn" onClick={() => navigate(-1)}>
          <ArrowBackRoundedIcon />
        </div>
        <h2>Login</h2>
        <form className="admin-login-form" onSubmit={login}>
          <div
            className="user-login-error-message"
            onClick={() => setError("")}
          >
            {error}
            {showLogoutBtn && (
              <div
                onClick={() => {
                  Cookies.remove("admin-token");
                  Cookies.get("isSuper")
                    ? Cookies.remove("isSuper")
                    : Cookies.remove("isOwner");
                  setSuccess("Logout Successfully!");
                  setShowLogoutBtn(false);
                }}
                style={{
                  color: "var(--primary-color)",
                  backgroundColor: "var(--text-color-1)",
                  paddingInline: ".5rem",
                  textAlign: "center",
                  display: "inline-block",
                  borderRadius: "1rem",
                  letterSpacing: "1px",
                  marginLeft: ".5rem",
                }}
              >
                Logout first!
              </div>
            )}
          </div>
          <div
            className="user-logout-success-message"
            onClick={() => setSuccess("")}
            style={{ color: "green", textAlign: "center", cursor: "pointer" }}
          >
            {success}
          </div>
          <TextField
            type="text"
            name="username"
            label="Username"
            style={{
              boxShadow: "none",
            }}
            onChange={handleLoginChange}
            required={true}
            value={adminLogin.username}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            style={{
              boxShadow: "none",
            }}
            onChange={handleLoginChange}
            required={true}
            value={adminLogin.password}
          />
          <div className="user-login-button">
            <MainButton
              type="submit"
              name={isLoading ? "" : "LOGIN"}
              style={{
                width: "100%",
              }}
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;

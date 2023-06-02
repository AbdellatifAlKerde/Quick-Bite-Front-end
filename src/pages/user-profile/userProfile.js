import React, { useContext, useEffect, useState } from "react";
import "./userProfile.css";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "../../components/text-field/TextField";
import MainButton from "../../components/main-button/MainButton";
import axios from "axios";
import CartContainer from "../../components/cart-container/cartContainer";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function UserProfile() {
  const navigate = useNavigate();
  const { user, orders, fetchOrders, updateUser } =
    useContext(ProductDataContext);
  const [userOrders, setUserOrders] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [userData, setUserData] = useState({
  //   username: "",
  //   address: "",
  //   phone: null,
  //   password: "",
  // });
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = user && user._id;
    const filteredOrders = orders.filter(
      (order) => order.user[0]._id === userId
    );
    if (filteredOrders.length > 0) {
      setUserOrders(filteredOrders);
    }
    setUserData(user);
  }, [user, orders]);

  const handleReload = () => {
    window.location.reload();
  };

  // const userOrdersData = () => {
  //   setUserOrders(filteredOrders);
  // };

  const handleUserChange = (e) => {
    const value = e.target.value;
    setUserData({ ...userData, [e.target.name]: value });
  };

  const editUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/${user._id}`,
        {
          username: userData.username,
          address: userData.address,
          phone: userData.phone,
          password: userData.password,
        }
      );
      console.log(response);
      updateUser(response.data.response);
      setUserData(response.data.response);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const editEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/user/email/${user._id}`,
        { email: email }
      );
      updateUser(response.data.response);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setError(e.response.data);
      setIsLoading(false);
    }
  };

  // const editPassword = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_URL}/api/user/password/${user._id}`,
  //       { password: password }
  //     );
  //     updateUser(response.data.response);
  //     setIsLoading(false);
  //     setPassword("");
  //   } catch (e) {
  //     console.log(e);
  //     setIsLoading(false);
  //   }
  // };

  const getRowId = (row) => {
    return row._id;
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "products",
      headerName: "Products",
      width: 400,
      // renderCell: (params) => {
      //   const products = params.row.products;
      //   console.log(products[0]._id.name);
      //   const orderedProducts = products
      //     .map((product) => `${product._id.name}: ${product.quantity}`)
      //     .join(", ");
      //   return (
      //     <div style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
      //       {orderedProducts}
      //     </div>
      //   );
      // },
      renderCell: (params) => {
        const productData = params.row.products.map((prod) => {
          return (
            <span
              key={prod._id}
              style={{
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <span>
                {prod._id.name} x {prod.quantity}{" "}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                (
                {prod.status === "pending" ? (
                  <AccessAlarmRoundedIcon style={{ color: "#ffb703" }} />
                ) : (
                  <CheckCircleOutlineRoundedIcon style={{ color: "green" }} />
                )}
                )<span style={{ marginInline: "6px" }}>| </span>
              </span>
            </span>
          );
        });
        return <span style={{ overflowX: "scroll" }}>{productData}</span>;
      },
    },
    { field: "total", headerName: "Total ($)", width: 80 },
    { field: "createdAt", headerName: "Order Date", width: 200 },
  ];

  return (
    <div className="user-profile-page">
      <div className="user-profile-page-container">
        <h2 className="user-profile-heading">User Profile</h2>
        <div className="user-profile-content">
          <div className="user-profile-data">
            <form onSubmit={editUser} className="user-profile-data-form">
              <div>
                <TextField
                  label="Username"
                  type="text"
                  name="username"
                  onChange={handleUserChange}
                  placeholder={userData ? userData.username : "Loading..."}
                  // required={true}
                  defaultValue={userData && userData.username}
                />
              </div>

              <div>
                <TextField
                  label="Address"
                  type="text"
                  name="address"
                  onChange={handleUserChange}
                  placeholder={userData ? userData.address : "Loading..."}
                  // required={true}
                  defaultValue={userData && userData.address}
                />
              </div>

              <div>
                <TextField
                  label="Phone"
                  type="number"
                  style={{
                    padding: "16px 15px",
                    borderRadius: "var(--border-radius-mini)",
                  }}
                  name="phone"
                  onChange={handleUserChange}
                  placeholder={userData ? userData.phone : "Loading..."}
                  // required={true}
                  defaultValue={userData && userData.phone}
                />
              </div>
              <div>
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  onChange={handleUserChange}
                  placeholder="******"
                  // required={true}
                  defaultValue={userData && userData.password}
                />
              </div>
              <MainButton
                type="submit"
                name={isLoading ? "Saving..." : "Save"}
                disabled={isLoading}
              ></MainButton>
            </form>
            <form onSubmit={editEmail} className="email-form">
              <div>
                <div
                  style={{ color: "var(--accent-color)", cursor: "pointer" }}
                  onClick={() => setError("")}
                >
                  {error}
                </div>
                <TextField
                  label="Email"
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder={user ? user.email : "Loading..."}
                  required={true}
                  value={email}
                />
              </div>
              <MainButton
                type="submit"
                name={isLoading ? "Saving..." : "Save"}
                disabled={isLoading}
              ></MainButton>
            </form>
          </div>
          <Box
            sx={{ height: 400, paddingInline: "2rem" }}
            className="user-profile-order-table-box"
          >
            <h2 className="user-profile-orders-heading">
              My Orders:{" "}
              <span
                className="user-profile-orders-reload"
                onClick={handleReload}
              >
                No orders? refresh.
              </span>
            </h2>
            <DataGrid
              sx={{ width: "100%" }}
              rows={userOrders}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              getRowId={getRowId}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
        </div>
      </div>
      <CartContainer />
    </div>
  );
}
export default UserProfile;

import React, { useContext, useEffect, useState } from "react";
import "./adminDashboardOwners.css";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import usersImage from "../../assets/images/admin-dashboard-users.webp";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MainButton from "../../components/main-button/MainButton";
import TextField from "../../components/text-field/TextField";
import DashboardPopup from "../../components/dashboard-popup/dashboardPopup";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PersonAddDisabledRoundedIcon from "@mui/icons-material/PersonAddDisabledRounded";
import Tooltip from "@mui/material/Tooltip";
import Spinner from "../../components/spinner/spinner";

function AdminDashboardOwners() {
  const { owners, restaurants, deleteOwner, fetchOwners } =
    useContext(ProductDataContext);
  const [addProfile, setAddProfile] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setAddProfile({ ...addProfile, [e.target.name]: value });
  };

  const handleFetch = () => {
    fetchOwners();
  };

  const handleSubmit = async (e) => {
    const form = {
      username: addProfile.username,
      password: addProfile.password,
      isSuper: true,
    };

    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/register`,
        form
      );
      console.log(response);
      setIsLoading(false);
      setOpenPopup(false);
      setAddProfile({
        username: "",
        password: "",
      });
      handleFetch();
    } catch (e) {
      console.log(e);
      setError(e.response.data.message);
      setIsLoading(false);
    }
  };

  const activate = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/admin/activate/${id}`,
        { isActive: true }
      );
      console.log(response);
      handleFetch();
    } catch (e) {
      console.log(e);
    }
  };

  const deactivate = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/admin/activate/${id}`,
        { isActive: false }
      );
      console.log(response);
      handleFetch();
    } catch (e) {
      console.log(e);
    }
  };

  if (!owners) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  const columns = [
    { field: "_id", headerName: "ID", width: 280 },
    {
      field: "username",
      headerName: "Username",
      width: 220,
    },
    {
      field: "isSuper",
      headerName: "Role",
      width: 220,
      renderCell: (params) => (
        <div>{params.row.isSuper ? "Admin" : "Owner"}</div>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 220,
      renderCell: (params) => (
        <div>
          {params.row.isActive ? (
            <span style={{ color: "green" }}>Active</span>
          ) : (
            <span style={{ color: "red" }}>Inactive</span>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="secondary"
            aria-label="delete"
            onClick={() => deleteOwner(params.id)}
          >
            <DeleteIcon style={{ color: "var(--accent-color)" }} />
          </IconButton>
          {params.row.isActive ? (
            <IconButton
              color="secondary"
              aria-label="delete"
              onClick={() => deactivate(params.id)}
            >
              <Tooltip title="deactivate" placement="top">
                <PersonAddDisabledRoundedIcon
                  style={{ color: "var(--accent-color)" }}
                />
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton
              color="secondary"
              aria-label="delete"
              onClick={() => activate(params.id)}
            >
              <Tooltip title="activate" placement="top">
                <PersonAddRoundedIcon style={{ color: "green" }} />
              </Tooltip>
            </IconButton>
          )}
        </>
      ),
    },
  ];

  const getRowId = (row) => {
    return row._id;
  };
  return (
    <div className="admiownersn-dashboard-users">
      <DashboardHero
        image={usersImage}
        alt="Owners dashboard image"
        title="Owners"
      />

      <div className="owner-dashboard-orders-table">
        <div className="owner-dashboard-products-table-add-btn">
          <MainButton
            name="Add"
            style={{ background: "var(--text-color-1)" }}
            onClick={() => setOpenPopup(true)}
          />
        </div>
        {openPopup && (
          <DashboardPopup
            title={"Add Admin"}
            onClick={() => {
              setOpenPopup(false);
              setAddProfile({
                username: "",
                password: "",
              });
              setError("");
            }}
            onSubmit={handleSubmit}
          >
            <div
              style={{ color: "var(--accent-color)", cursor: "pointer" }}
              onClick={() => setError("")}
            >
              {error}
            </div>
            <div>
              <TextField
                label="Username"
                type="text"
                name="username"
                autoFocus={true}
                onChange={handleChange}
                value={addProfile.username}
                required={true}
              />
            </div>
            <div>
              <TextField
                label="Password"
                type="password"
                name="password"
                onChange={handleChange}
                value={addProfile.password}
                required={true}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <MainButton
                // name="Save"
                style={{ width: "100%", background: "var(--text-color-1)" }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </MainButton>
            </div>
          </DashboardPopup>
        )}
        <DataGrid
          sx={{ width: "100%", height: "58vh", fontSize: "1.2rem" }}
          rows={owners}
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
      </div>
    </div>
  );
}

export default AdminDashboardOwners;

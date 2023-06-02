import React, { useContext } from "react";
import "./adminDashboardUsers.css";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import usersImage from "../../assets/images/admin-dashboard-users.webp";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminDashboardUsers() {
  const { users, deleteUser } = useContext(ProductDataContext);

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "username",
      headerName: "Username",
      width: 220,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 220,
    },
    {
      field: "address",
      headerName: "Address",
      width: 220,
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
            onClick={() => deleteUser(params.id)}
          >
            <DeleteIcon style={{ color: "var(--accent-color)" }} />
          </IconButton>
        </>
      ),
    },
  ];

  const getRowId = (row) => {
    return row._id;
  };
  return (
    <div className="admin-dashboard-users">
      <DashboardHero
        image={usersImage}
        alt="Users dashboard image"
        title="Users"
      />
      <div className="owner-dashboard-orders-table">
        <DataGrid
          sx={{ width: "100%", height: "58vh", fontSize: "1.2rem" }}
          rows={users}
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

export default AdminDashboardUsers;

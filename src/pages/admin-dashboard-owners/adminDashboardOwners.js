import React, { useContext, useEffect, useState } from "react";
import "./adminDashboardOwners.css";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import usersImage from "../../assets/images/admin-dashboard-users.webp";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminDashboardOwners() {
  const { owners, restaurants, deleteOwner } = useContext(ProductDataContext);

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

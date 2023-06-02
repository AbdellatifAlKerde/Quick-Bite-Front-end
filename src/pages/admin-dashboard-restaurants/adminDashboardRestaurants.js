import React, { useContext } from "react";
import "./adminDashboardRestaurants.css";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import restaurantImage from "../../assets/images/admin-dashboard-restaurant.jpg";

function AdminDashboardRestaurants() {
  const { restaurants, deleteRestaurant } = useContext(ProductDataContext);

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "image",
      headerName: "Image",
      width: 220,
      renderCell: (params) => {
        const image = params.row.image;

        return (
          <div
            style={{
              width: "100px",
              height: "50px",
              borderRadius: "var(--border-radius-mini)",
              overflow: "hidden",
            }}
          >
            <img
              // src={`${process.env.REACT_APP_API_URL}/${image}`}
              src={image}
              style={{ objectFit: "cover" }}
            />
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 220,
    },
    {
      field: "admin",
      headerName: "Owner",
      width: 220,
      renderCell: (params) => <div>{params.row.admin.username}</div>,
    },
    {
      field: "description",
      headerName: "Description",
      width: 220,
    },
    {
      field: "location",
      headerName: "Location",
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
            onClick={() => deleteRestaurant(params.id)}
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
        image={restaurantImage}
        alt="Restaurants dashboard image"
        title="Restaurants"
      />
      <div className="owner-dashboard-orders-table">
        <DataGrid
          sx={{ width: "100%", height: "58vh", fontSize: "1.2rem" }}
          rows={restaurants}
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

export default AdminDashboardRestaurants;

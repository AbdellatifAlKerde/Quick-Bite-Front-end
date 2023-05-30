import React, { useEffect, useState, useContext } from "react";
import "./ownerDashboardOrders.css";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import ordersImage from "../../assets/images/dashboard-hero-orders.jpg";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import { DataGrid } from "@mui/x-data-grid";

function OwnerDashboardOrders() {
  const { orders, restaurants, owner } = useContext(ProductDataContext);
  const [restaurant, setRestaurant] = useState({});
  const [restoOrders, setRestoOrders] = useState({});

  useEffect(() => {
    const filteredRestaurant = restaurants.filter(
      (resto) => resto.admin._id === owner._id
    );

    if (filteredRestaurant.length > 0) {
      setRestaurant(filteredRestaurant[0]);
    }
  }, [restaurant, restaurants]);

  useEffect(() => {
    const filteredOrders = orders.filter((order) =>
      order.products.some(
        (product) => product._id.restaurant_id._id === restaurant._id
      )
    );

    if (filteredOrders.length > 0) {
      setRestoOrders(filteredOrders);
    }
  }, [restaurant, orders]);

  console.log(restoOrders);

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "user.username",
      headerName: "Username",
      width: 80,
      valueGetter: (params) => {
        return params.row.user.map((user) => user.username).join(", ");
      },
    },
    {
      field: "user.phone",
      headerName: "Phone",
      width: 100,
      valueGetter: (params) => {
        return params.row.user.map((user) => user.phone).join(", ");
      },
    },
    {
      field: "user.address",
      headerName: "Address",
      width: 100,
      valueGetter: (params) => {
        return params.row.user.map((user) => user.address).join(", ");
      },
    },
    {
      field: "products",
      headerName: "Name",
      width: 220,
      valueGetter: (params) => {
        return params.row.products
          .map((prod) => prod._id.name + " x " + prod.quantity)
          .join(" | ");
      },

      renderCell: (params) => {
        const productData = params.row.products
          .map((prod) => prod._id.name + " x " + prod.quantity)
          .join(" | ");

        return (
          <div
            style={{
              overflow: "scroll",
            }}
          >
            {productData}
          </div>
        );
      },
    },

    {
      field: "total",
      headerName: "Total ($)",
      width: 80,
    },
  ];

  const getRowId = (row) => {
    return row._id;
  };

  return (
    <div className="owner-dashboard-orders">
      <div className="owner-dashboard-orders-container">
        <DashboardHero image={ordersImage} alt="Order image" title="Orders" />
        <div className="owner-dashboard-orders-table">
          <DataGrid
            sx={{ width: "100%", height: "58vh" }}
            rows={restoOrders}
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
    </div>
  );
}

export default OwnerDashboardOrders;

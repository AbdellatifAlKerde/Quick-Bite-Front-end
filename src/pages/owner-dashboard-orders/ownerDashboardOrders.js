import React, { useEffect, useState, useContext } from "react";
import "./ownerDashboardOrders.css";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import ordersImage from "../../assets/images/dashboard-hero-orders.jpg";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import { DataGrid } from "@mui/x-data-grid";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { IconButton } from "@mui/material";

function OwnerDashboardOrders() {
  const { allOrders, restaurants, owner, fetchOrders } =
    useContext(ProductDataContext);
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
    const filteredOrders = allOrders.filter((order) =>
      order.products.some(
        (product) => product._id.restaurant_id._id === restaurant._id
      )
    );
    if (filteredOrders.length > 0) {
      setRestoOrders(filteredOrders);
    }
    console.log(allOrders);
  }, [restaurant, allOrders]);

  const handleRefetch = () => {
    fetchOrders();
  };

  const approveOrder = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/order/status/${id}`,
        { status: "delivered" }
      );
      console.log(response);
      handleRefetch();
    } catch (e) {
      console.log(e);
    }
  };

  const undoApproveOrder = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/order/status/${id}`,
        { status: "pending" }
      );
      console.log(response);
      handleRefetch();
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "user.username",
      headerName: "Username",
      width: 220,
      valueGetter: (params) => {
        return params.row.user.map((user) => user.username).join(", ");
      },
    },
    {
      field: "user.phone",
      headerName: "Phone",
      width: 220,
      valueGetter: (params) => {
        return params.row.user.map((user) => user.phone).join(", ");
      },
    },
    {
      field: "user.address",
      headerName: "Address",
      width: 220,
      valueGetter: (params) => {
        return params.row.user.map((user) => user.address).join(", ");
      },
    },
    {
      field: "products",
      headerName: "Name",
      width: 300,
      // valueGetter: (params) => {
      //   return params.row.products
      //     .map(
      //       (prod) =>
      //         prod._id.name + " x " + prod.quantity + ` (${prod.status})`
      //     )
      //     .join(" | ");
      // },

      renderCell: (params) => {
        const productData = params.row.products.map((prod) => {
          return (
            <span
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
    {
      field: "total",
      headerName: "Total ($)",
      width: 160,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.products[0].status === "pending" ? (
              <IconButton
                color="secondary"
                aria-label="delete"
                onClick={() => approveOrder(params.id)}
              >
                <Tooltip title="approve" placement="top">
                  <DoneRoundedIcon style={{ color: "green" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <IconButton
                color="secondary"
                aria-label="delete"
                onClick={() => undoApproveOrder(params.id)}
              >
                <Tooltip title="undo" placement="top">
                  <UndoRoundedIcon style={{ color: "#222" }} />
                </Tooltip>
              </IconButton>
            )}
          </>
        );
        //   const productData = params.row.map((prod) => {
        //   // return productData;
        // },
      },
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
            sx={{ width: "100%", height: "58vh", fontSize: "1.2rem" }}
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

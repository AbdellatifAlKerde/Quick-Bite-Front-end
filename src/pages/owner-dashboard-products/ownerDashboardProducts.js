import React, { useState, useContext, useEffect } from "react";
import "./ownerDashboardProducts.css";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import productHero from "../../assets/images/dashboard-hero-products.jpg";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import Spinner from "../../components/spinner/spinner";
import { DataGrid } from "@mui/x-data-grid";
import MainButton from "../../components/main-button/MainButton";
import DashboardPopup from "../../components/dashboard-popup/dashboardPopup";
import TextField from "../../components/text-field/TextField";
import axios from "axios";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function OwnerDashboardProducts() {
  const { restaurants, owner, allProducts, allCategories, fetchProducts } =
    useContext(ProductDataContext);
  const [restaurant, setRestaurant] = useState({});
  const [restoProducts, setRestoProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState({});
  const [productAddData, setProductAddData] = useState({
    name: "",
    description: "",
    price: "",
    category: null,
    restaurant_id: restaurant._id,
  });

  const [productEditData, setProductEditData] = useState({
    name: "",
    description: "",
    price: "",
    category: null,
    restaurant_id: restaurant._id,
  });
  const [isEdit, setIsEdit] = useState(false);

  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (event) => {
    const value = event.target.value;
    setProductAddData({ ...productAddData, [event.target.name]: value });
  };

  const handleEditChange = (event) => {
    const value = event.target.value;
    setProductEditData({ ...productEditData, [event.target.name]: value });
  };

  const triggerEdit = () => {
    setIsEdit(true);
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let image = e.target.files[0];
    setImage(image);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (Object.keys(image).length !== 0) {
        const fd = new FormData();
        fd.append("image", image);

        const imgBBResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_KEY}`,
          fd
        );

        imageUrl = imgBBResponse.data.data.display_url;
      }

      const formData = new FormData();
      if (imageUrl) {
        formData.append("image", imageUrl);
      }
      formData.append("name", productAddData.name);
      formData.append("description", productAddData.description);
      formData.append("price", productAddData.price);
      formData.append("category", productAddData.category);
      formData.append("restaurant_id", restaurant._id);

      // const formDt = {
      //   image: imageUrl,
      //   name: productAddData.name,
      //   description: productAddData.description,
      //   price: productAddData.price,
      //   category: productAddData.category,
      //   restaurant_id: restaurant._id,
      // };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/product`,
        formData,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log(response);
      setIsSubmitting(false);
      setOpenPopup(false);
      setProductAddData({
        name: "",
        description: "",
        price: "",
        category: "",
      });
      setError("");
      fetchProducts();
    } catch (e) {
      console.error(
        "Error uploading image to ImgBB and saving to the database:",
        error
      );
      console.log(e);
      // setError(e.response.data);
      setIsSubmitting(false);
    }
  };

  const editProduct = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (Object.keys(image).length !== 0) {
        const fd = new FormData();
        fd.append("image", image);

        const imgBBResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_KEY}`,
          fd
        );

        imageUrl = imgBBResponse.data.data.display_url;
      }

      const formData = new FormData();
      if (imageUrl) {
        formData.append("image", imageUrl);
      }
      formData.append("name", productAddData.name);
      formData.append("description", productAddData.description);
      formData.append("price", productAddData.price);
      formData.append("category", productAddData.category);
      formData.append("restaurant_id", restaurant._id);

      // const formDt = {
      //   image: imageUrl,
      //   name: productEditData.name,
      //   description: productEditData.description,
      //   price: productEditData.price,
      //   category: productEditData.category,
      //   restaurant_id: restaurant._id,
      // };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/product/${editId._id}`,
        formData,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );

      console.log(response);
      setIsSubmitting(true);
      setOpenPopup(false);
      setIsEdit(false);
      setProductEditData({
        name: "",
        description: "",
        price: "",
        category: "",
      });
      setError("");
    } catch (e) {
      console.log(e);
      setError(e.response.data);
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--secondary-color)",
      cancelButtonColor: "var(--accent-color)",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios
            .delete(`${process.env.REACT_APP_API_URL}/api/product/${id}`)
            .then((response) => {
              console.log(response.data);
              // getProducts();
              // getCategories();
            });
        } catch (error) {
          console.log(error);
        }
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    const filteredRestaurant = restaurants.filter(
      (resto) => resto.admin._id === owner._id
    );

    if (filteredRestaurant.length > 0) {
      setRestaurant(filteredRestaurant[0]);
    }
  }, [restaurant, restaurants, owner._id]);

  useEffect(() => {
    const filteredProducts = allProducts.filter(
      (product) => product.restaurant_id._id === restaurant._id
    );

    if (filteredProducts.length > 0) {
      setRestoProducts(filteredProducts);
    }
  }, [restaurant, allProducts]);

  if (!allProducts || !restaurant) {
    return (
      <div className="owner-dashboard-loading">
        <Spinner />
      </div>
    );
  }

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "image",
      headerName: "Image",
      width: 120,
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
            <img src={image} alt="" style={{ objectFit: "cover" }} />
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        const name = params.row.name;

        return (
          <div style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
            {name}
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      renderCell: (params) => {
        const description = params.row.description;

        return (
          <div
            style={{
              overflow: "scroll",
            }}
          >
            {description}
          </div>
        );
      },
    },
    { field: "price", headerName: "Price ($)", width: 80 },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      valueGetter: (params) => {
        return params.row.category.name;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="secondary"
            aria-label="delete"
            onClick={() => deleteProduct(params.id)}
          >
            <DeleteIcon style={{ color: "var(--accent-color)" }} />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={() => {
              triggerEdit();
              setOpenPopup(true);
              setEditId(params.row);
              setProductEditData({
                name: params.row.name,
                description: params.row.description,
                price: params.row.price,
                category: params.row.category,
              });
            }}
          >
            <EditIcon style={{ color: "var(--text-color-1)" }} />
          </IconButton>
        </>
      ),
    },
  ];

  const getRowId = (row) => {
    return row._id;
  };

  return (
    <div className="owner-dashboard-products">
      <div className="owner-dashboard-products-container">
        <DashboardHero
          image={productHero}
          alt="Food image"
          title="My Products"
        />
        <div className="owner-dashboard-products-table">
          <div className="owner-dashboard-products-table-add-btn">
            <MainButton
              name="Add"
              style={{ background: "var(--text-color-1)" }}
              onClick={() => setOpenPopup(true)}
            />
          </div>
          {openPopup && (
            <DashboardPopup
              title={isEdit ? "Edit Product" : "Add Product"}
              onClickClose={
                isEdit
                  ? () => {
                      setOpenPopup(false);
                      setIsEdit(false);
                      setProductEditData({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        image: null,
                      });
                      setError("");
                    }
                  : () => {
                      setOpenPopup(false);
                      setProductAddData({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        image: null,
                      });
                      setError("");
                    }
              }
              onClick={
                isEdit
                  ? () => {
                      setOpenPopup(false);
                      setIsEdit(false);
                      setProductEditData({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        image: null,
                      });
                      setError("");
                    }
                  : () => {
                      setOpenPopup(false);
                      setProductAddData({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        image: null,
                      });
                      setError("");
                    }
              }
              onSubmit={isEdit ? editProduct : addProduct}
            >
              <div
                style={{ color: "var(--accent-color)", cursor: "pointer" }}
                onClick={() => setError("")}
              >
                {error}
              </div>
              <div>
                <TextField
                  label="Name"
                  type="text"
                  name="name"
                  autoFocus={isEdit ? true : false}
                  onChange={isEdit ? handleEditChange : handleFormChange}
                  // value={isEdit && editId.name}
                  defaultValue={isEdit ? editId.name : ""}
                  required={true}
                  // placeholder={isEdit && editId.name}
                />
              </div>
              <div>
                <TextField
                  label="Description"
                  type="text"
                  name="description"
                  onChange={isEdit ? handleEditChange : handleFormChange}
                  // value={isEdit && editId.description}
                  required={true}
                  defaultValue={isEdit ? editId.description : ""}
                  // placeholder={isEdit && editId.description}
                />
              </div>
              <div>
                <TextField
                  label="price"
                  type="number"
                  style={{
                    padding: "16px 15px",
                    borderRadius: "var(--border-radius-mini)",
                  }}
                  name="price"
                  onChange={isEdit ? handleEditChange : handleFormChange}
                  // value={isEdit && editId.price}
                  required={true}
                  defaultValue={isEdit ? editId.price : ""}
                  // placeholder={isEdit && editId.price}
                />
              </div>
              <div>
                <label>
                  Category
                  <select
                    className="dashboard-admin-select"
                    name="category"
                    // value={isEdit && editId.category._id}
                    // or formData.category.name
                    // onChange={
                    //   isEdit
                    //     ? (e) =>
                    //         setProductEditData({
                    //           ...productEditData,
                    //           category: { _id: e.target.value },
                    //         })
                    //     : (e) =>
                    //         setProductAddData({
                    //           ...productAddData,
                    //           category: { _id: e.target.value },
                    //         })
                    // }
                    onChange={isEdit ? handleEditChange : handleFormChange}
                    // defaultValue={editId && editId.category._id}
                  >
                    {allCategories &&
                      allCategories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              <div>
                <input
                  type="file"
                  name="image"
                  id="file-input"
                  onChange={handleImageChange}
                  // value={isEdit && editId.image}
                  className="file-input__input"
                  // required={true}
                />
                <label className="file-input__label" htmlFor="file-input">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="upload"
                    className="svg-inline--fa fa-upload fa-w-16"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                    ></path>
                  </svg>
                  <span>Upload image (required)</span>
                  <span> {image.name}</span>
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <MainButton
                  name={isEdit ? "Save" : "Add"}
                  style={{ width: "100%", background: "var(--text-color-1)" }}
                  type="submit"
                >
                  {isSubmitting && "..."}
                </MainButton>
              </div>
            </DashboardPopup>
          )}
          {/* <TextField /> */}

          <DataGrid
            sx={{ width: "100%", height: "58vh", fontSize: "1.2rem" }}
            rows={restoProducts}
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

export default OwnerDashboardProducts;

import React, { useState, useContext, useEffect } from "react";
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
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import categoriesImage from "../../assets/images/admin-dashboard-categories.jpg";

function AdminDashboardCategories() {
  const { categories, fetchCategories } = useContext(ProductDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryAddData, setCategoryAddData] = useState({
    name: "",
  });

  const [categoryEditData, setCategoryEditData] = useState({
    name: "",
  });
  const [image, setImage] = useState({});

  const [isEdit, setIsEdit] = useState(false);

  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (event) => {
    const value = event.target.value;
    setCategoryAddData({ ...categoryAddData, [event.target.name]: value });
  };

  const handleEditChange = (event) => {
    const value = event.target.value;
    setCategoryEditData({ ...categoryEditData, [event.target.name]: value });
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let image = e.target.files[0];
    setImage(image);
  };

  const handleFetchCategories = () => {
    fetchCategories();
  };

  const addCategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("image", image, image.name);

      const imgBBResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_KEY}`,
        fd
      );

      const imageUrl = imgBBResponse.data.data.display_url;

      const formData = new FormData();
      formData.append("image", imageUrl);
      formData.append("name", categoryAddData.name);

      const formDt = {
        image: imageUrl,
        name: categoryAddData.name,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/category`,
        formDt,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log(response);
      setIsSubmitting(false);
      setOpenPopup(false);
      handleFetchCategories();
    } catch (error) {
      console.error(
        "Error uploading image to ImgBB and saving to the database:",
        error
      );
      setIsSubmitting(false);
    }
  };

  const editCategory = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("image", image, image.name);

    const imgBBResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_KEY}`,
      fd
    );

    const imageUrl = imgBBResponse.data.data.display_url;

    setIsSubmitting(true);
    const categoryEditForm = new FormData();
    categoryEditForm.append("name", categoryEditData.name);
    categoryEditForm.append("image", imageUrl);

    const formDt = {
      image: imageUrl,
      name: categoryEditData.name,
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/category/${editId._id}`,
        formDt,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      setIsSubmitting(true);
      setOpenPopup(false);
      setIsEdit(false);
      setCategoryEditData({
        name: "",
      });
      setError("");
    } catch (e) {
      console.log(e);
      setError(e.response.data);
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id) => {
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
            .delete(`${process.env.REACT_APP_API_URL}/api/category/${id}`)
            .then((response) => {
              console.log(response.data);
              handleFetchCategories();
            });
        } catch (error) {
          console.log(error);
        }
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      }
    });
  };

  const triggerEdit = () => {
    setIsEdit(true);
  };

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
            <img src={image} style={{ objectFit: "cover" }} />
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
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="secondary"
            aria-label="delete"
            onClick={() => deleteCategory(params.id)}
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
              setCategoryEditData({
                name: params.row.name,
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
      {/* {console.log(productEditData.image)} */}
      <div className="owner-dashboard-products-container">
        <DashboardHero
          style={{ filter: "brightness(30%)" }}
          image={categoriesImage}
          alt="Categories image"
          title="Categories"
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
              title={isEdit ? "Edit Category" : "Add Category"}
              onClick={
                isEdit
                  ? () => {
                      setOpenPopup(false);
                      setIsEdit(false);
                      setCategoryEditData({
                        name: "",
                      });
                      setError("");
                    }
                  : () => {
                      setOpenPopup(false);
                      setCategoryAddData({
                        name: "",
                      });
                      setError("");
                    }
              }
              onSubmit={isEdit ? editCategory : addCategory}
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
                  // value={isEdit ? productEditData.name : productAddData.name}
                  // defaultValue={isEdit ? editId.name : ""}
                  required={true}
                  // placeholder={isEdit && editId.name}
                />
              </div>

              <div>
                <input
                  type="file"
                  name="image"
                  id="file-input"
                  onChange={handleImageChange}
                  // value={isEdit ? productEditData.image : productAddData.image}
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
                  <span>Upload image</span>
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
            rows={categories}
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

export default AdminDashboardCategories;

import React, { useEffect, useContext, useState } from "react";
import "./ownerDashboardHome.css";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import Spinner from "../../components/spinner/spinner";
import DashboardHero from "../../components/dashboard-hero/dashboardHero";
import axios from "axios";
import TextField from "../../components/text-field/TextField";
import MainButton from "../../components/main-button/MainButton";

function OwnerDashboardHome() {
  const { restaurants, owner, updateOwner, fetchRestaurants } =
    useContext(ProductDataContext);
  const [restaurant, setRestaurant] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ownerData, setOwnerData] = useState({
    username: "",
    password: "",
  });
  const [ownerIsLoading, setOwnerIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Restaurant

  const handleRestoChange = (e) => {
    const value = e.target.value;
    setRestaurant({ ...restaurant, [e.target.name]: value });
  };

  const editRestaurant = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/rest/${restaurant._id}`,
        {
          name: restaurant.name,
          description: restaurant.description,
          location: restaurant.location,
        }
      );
      // console.log(response);
      setRestaurant(response.data.response);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const editAddImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/rest/image/${restaurant._id}`,
        formData
      );
      console.log(response);
      setRestaurant(response.data.response);
      setIsLoading(false);
      setImage(null);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  // Owner

  const handleOwnerChange = (e) => {
    const value = e.target.value;
    setOwnerData({ ...ownerData, [e.target.name]: value });
  };

  const editOwner = async (e) => {
    e.preventDefault();
    setOwnerIsLoading(true);
    const ownerForm = {
      username: ownerData.username,
      password: ownerData.password,
    };
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/${owner._id}`,
        ownerForm
      );
      console.log(response);
      updateOwner(response.data.response);
      setOwnerIsLoading(false);
      setOwnerData({
        username: "",
        password: "",
      });
    } catch (e) {
      console.log(e);
      setError(e.response.data);
      setOwnerIsLoading(false);
    }
  };

  // const editUsername = async (e) => {
  //   e.preventDefault();
  //   setOwnerIsLoading(true);

  //   try {
  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_URL}/api/admin/username/${owner._id}`,
  //       { username: username }
  //     );
  //     console.log(response);
  //     updateOwner(response.data.response);
  //     setOwnerIsLoading(false);
  //     setUsername("");
  //   } catch (e) {
  //     console.log(e);
  //     setError(e.response.data.message);
  //     setOwnerIsLoading(false);
  //   }
  // };

  // const editPassword = async (e) => {
  //   e.preventDefault();
  //   setOwnerIsLoading(true);

  //   try {
  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_URL}/api/admin/password/${owner._id}`,
  //       { password: password }
  //     );
  //     console.log(response);
  //     updateOwner(response.data.response);
  //     setOwnerIsLoading(false);
  //     setPassword("");
  //   } catch (e) {
  //     console.log(e);
  //     setOwnerIsLoading(false);
  //   }
  // };

  useEffect(() => {
    const filteredRestaurant = restaurants.filter(
      (resto) => resto.admin._id === owner._id
    );

    if (filteredRestaurant.length > 0) {
      setRestaurant(filteredRestaurant[0]);
    }
  }, [owner, restaurants]);

  if (!restaurant) {
    return (
      <div className="owner-dashboard-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="owner-dashboard-home">
      <div className="owner-dashboard-home-restaurant">
        <DashboardHero
          image={`${process.env.REACT_APP_API_URL}/${restaurant.image}`}
          alt={restaurant.name}
          title={restaurant.name}
        />
      </div>
      <h2 className="owner-profile-title">Owner Profile</h2>
      <div className="owner-dashboard-home-container">
        <div className="user-profile-data owner-profile-data">
          <form onSubmit={editRestaurant}>
            <div>
              <TextField
                label="Restaurant name"
                type="text"
                name="name"
                onChange={handleRestoChange}
                placeholder={restaurant ? restaurant.name : "Loading..."}
                // required={true}
                defaultValue={restaurant.name}
              />
            </div>

            <div>
              <label>
                About your restaurant
                <textarea
                  className="description-textarea"
                  name="description"
                  rows={5}
                  defaultValue={restaurant.description}
                  placeholder={
                    restaurant ? restaurant.description : "Loading..."
                  }
                  onChange={handleRestoChange}
                ></textarea>
              </label>
            </div>

            <div>
              <TextField
                label="Restaurant location"
                type="text"
                name="location"
                onChange={handleRestoChange}
                placeholder={restaurant ? restaurant.location : "Loading..."}
                // required={true}
                defaultValue={restaurant.location}
              />
            </div>

            <MainButton
              type="submit"
              style={{ backgroundColor: "var(--text-color-1)" }}
              name={isLoading ? "Saving..." : "Save"}
              disabled={isLoading}
            ></MainButton>
          </form>
          <form
            className="owner-dashboard-upload-image"
            onSubmit={editAddImage}
          >
            <div>
              <input
                type="file"
                name="image"
                id="file-input"
                onChange={handleImageChange}
                // value={isEdit ? productEditData.image : productAddData.image}
                className="file-input__input"
                required={true}
              />
              <label className="file-input__label" htmlFor="file-input">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="upload"
                  class="svg-inline--fa fa-upload fa-w-16"
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
              </label>
            </div>
            <MainButton
              type="submit"
              style={{ backgroundColor: "var(--text-color-1)" }}
              name={isLoading ? "Saving..." : "Save"}
              disabled={isLoading}
            ></MainButton>
          </form>
        </div>
        <div className="user-profile-data owner-profile-data">
          <div
            style={{ color: "var(--accent-color)", cursor: "pointer" }}
            onClick={() => setError("")}
          >
            {error}
          </div>
          <form onSubmit={editOwner}>
            <div>
              <TextField
                label="Username"
                type="text"
                name="username"
                onChange={handleOwnerChange}
                placeholder={owner ? owner.username : "Loading..."}
                required={true}
                value={ownerData.username}
              />
            </div>
            <div>
              <TextField
                label="Password"
                type="text"
                name="password"
                onChange={handleOwnerChange}
                placeholder="******"
                required={true}
                value={ownerData.password}
              />
            </div>
            <MainButton
              type="submit"
              name={ownerIsLoading ? "Saving..." : "Save"}
              disabled={ownerIsLoading}
              style={{ backgroundColor: "var(--text-color-1)" }}
            ></MainButton>
          </form>
        </div>
      </div>
    </main>
  );
}

export default OwnerDashboardHome;

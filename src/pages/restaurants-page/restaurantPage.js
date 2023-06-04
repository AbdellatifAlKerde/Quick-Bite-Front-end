import React, { useContext } from "react";
import "./restaurantPage.css";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import ProductHeader from "../../components/product-header/productHeader";
import RestaurantCard from "../../components/restaurant-card/restaurantCard";
import { useNavigate } from "react-router-dom";
import ProductCardSkeleton from "../../components/product-card-skeleton/productCardSkeleton";
import CartContainer from "../../components/cart-container/cartContainer";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function RestaurantPage() {
  const navigate = useNavigate();
  const {
    restaurants,
    isLoading,
    handleRestaurantsPageChange,
    restaurantsPage,
    totalRestaurantsPages,
  } = useContext(ProductDataContext);
  return (
    <div className="restaurants-page">
      <ProductHeader />
      <section className="restaurant-page-hero">
        <h2>Discover Our Restaurants</h2>
      </section>
      <CartContainer />
      <section className="restaurants-page-cards-section">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : restaurants.map((rest) => (
              <RestaurantCard
                key={rest._id}
                src={rest.image}
                name={rest.name}
                description={rest.description}
                location={rest.location}
                onClick={() => navigate(`/restaurant/${rest._id}`)}
              />
            ))}
      </section>
      <Stack
        spacing={2}
        mt={2}
        direction="row"
        justifyContent="center"
        marginTop="2rem"
      >
        <Pagination
          count={totalRestaurantsPages}
          page={restaurantsPage}
          onChange={handleRestaurantsPageChange}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#222", // Replace 'your-color' with your desired color
            },
            "& .Mui-selected": {
              color: "#fff", // Replace 'your-color' with your desired color
              backgroundColor: "var(--accent-color)",
              background: "var(-accent-color)",
            },
          }}
        />
      </Stack>
    </div>
  );
}

export default RestaurantPage;

import React, { useState, useContext } from "react";
import heroSectionImg from "../../assets/images/home-page-hero-section.svg";
import "./homePage.css";
import SearchBar from "../../components/search-bar/SearchBar";
import card1 from "../../assets/images/group photo-amico.svg";
import card2 from "../../assets/images/Delivery-amico.svg";
import card3 from "../../assets/images/Waiters-amico.svg";
import CartContainer from "../../components/cart-container/cartContainer";
import { ProductDataContext } from "../../components/product-data-provider/productDataProvider";
import ProductCard from "../../components/product-card/productCard";
import ProductCardSkeleton from "../../components/product-card-skeleton/productCardSkeleton";
import ProductPopup from "../../components/product-popup/productPopup";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const { allProducts, addToCartPopup, isLoading } =
    useContext(ProductDataContext);
  const [countItems, setCountItems] = useState(1);
  const handleAddToCartPopup = (product) => {
    addToCartPopup(product, countItems);
  };
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const limitedProducts = allProducts.slice(-3);

  const close = () => {
    document.querySelector(".cart-container").classList.toggle("close");
  };

  return (
    <div className="home-page">
      {selectedProduct && (
        <ProductPopup
          src={selectedProduct.image}
          alt={selectedProduct.name}
          title={selectedProduct.name}
          description={selectedProduct.description}
          price={selectedProduct.price}
          onClickClose={() => {
            setSelectedProduct(null);
            setCountItems(1);
          }}
          onClickOutsideClose={() => setSelectedProduct(null)}
          onClickAddToCart={() => {
            handleAddToCartPopup(selectedProduct);
            close();
            setSelectedProduct(null);
            setCountItems(1);
          }}
          buttonName={`Add ${countItems} to cart  • ${
            countItems * selectedProduct.price
          }$`}
          inputOnChange={(e) => setCountItems(e.target.value)}
          inputDefaultValue={1}
        />
      )}
      <CartContainer />
      <section className="home-page-hero-section">
        <div className="hero-section-desc hero-section-content">
          <h1>Restaurants & more delivered to your door</h1>
          <SearchBar style={{ width: "90%" }} />
        </div>
        <div className="hero-section-image hero-section-content">
          <img
            src={heroSectionImg}
            alt="Delivery Driver"
            width="100%"
            height="100%"
          />
        </div>
      </section>
      <section className="home-page-service-section">
        <div className="home-page-service-section-heading">
          <h3>what we serve</h3>
          <h2>Your Favourite Food Delivery Partner</h2>
        </div>
        <div className="cards">
          <div className="card">
            <div className="card-image">
              <img src={card1} alt="man photo" />
            </div>
            <div className="card-desc">
              <h2>Easy To Order</h2>
              <p>You only need a few steps in ordering food.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-image">
              <img src={card2} alt="Delivery man photo" />
            </div>
            <div className="card-desc">
              <h2>Fastest Delivery</h2>
              <p>Delivery that is always ontime even faster.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-image">
              <img src={card3} alt="waiter photo" />
            </div>
            <div className="card-desc">
              <h2>Best Quality</h2>
              <p>Not only fast for us, quality is also number one.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="home-page-products-section">
        <h3>what we have</h3>
        <h2 className="home-page-products-title">Featured Products</h2>
        <div className="home-page-products-show-more">
          <Link to="/products">
            View more <span>&#8594;</span>
          </Link>
        </div>
        <div className="home-page-products-cards">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : limitedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  src={product.image}
                  alt={product.name}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  style={{ flex: "1 1 300px" }}
                  onClick={() => {
                    handleProductClick(product);
                  }}
                />
              ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect, createContext } from "react";

// Create a new context for the product data
const ProductDataContext = createContext();

function ProductDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState([]);
  const [owner, setOwner] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const loggedUser = localStorage.getItem("user");
  const loggedAdmin = localStorage.getItem("admin");
  const loggedOwner = localStorage.getItem("owner");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCategories();
    fetchRetaurants();

    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    const loggedAdmin = localStorage.getItem("admin");
    if (loggedAdmin) {
      setAdmin(JSON.parse(loggedAdmin));
    }
    const loggedOwner = localStorage.getItem("owner");
    if (loggedOwner) {
      setOwner(JSON.parse(loggedOwner));
    }
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, [loggedAdmin, loggedUser, loggedOwner]);

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    const newUserData = localStorage.getItem("user");
    setUser(JSON.parse(newUserData));
  };

  const updateOwner = (updatedOwner) => {
    localStorage.setItem("owner", JSON.stringify(updatedOwner));
    const newOwnerData = localStorage.getItem("owner");
    setOwner(JSON.parse(newOwnerData));
  };

  const updateAdmin = (updatedAdmin) => {
    localStorage.setItem("admin", JSON.stringify(updatedAdmin));
    const newAdminData = localStorage.getItem("admin");
    setAdmin(JSON.parse(newAdminData));
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [cartItems]);

  const updateLocalStorage = (updatedItems) => {
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      const updatedItems = cartItems.map((cartItem) => {
        if (cartItem._id === item._id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      setCartItems(updatedItems);
      updateLocalStorage(updatedItems);
    } else {
      const newItem = { ...item, quantity: 1 };
      const updatedItems = [...cartItems, newItem];
      setCartItems(updatedItems);
      updateLocalStorage(updatedItems);
    }
  };

  const addToCartPopup = (item, quantity = 1) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      const updatedItems = cartItems.map((cartItem) => {
        if (cartItem._id === item._id) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + Number(quantity),
          };
        }
        return cartItem;
      });
      setCartItems(updatedItems);
      updateLocalStorage(updatedItems);
    } else {
      const newItem = { ...item, quantity: Number(quantity) };
      const updatedItems = [...cartItems, newItem];
      setCartItems(updatedItems);
      updateLocalStorage(updatedItems);
    }
  };

  const editCartItemQuantity = (itemId, newQuantity) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === itemId) {
        return {
          ...item,
          quantity: Number(newQuantity),
        };
      }
      return item;
    });
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const removeFromCart = (itemId) => {
    const updatedItems = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    updateLocalStorage([]);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/product${
        selectedCategory ? `/category/${selectedCategory}` : ""
      }`;
      const response = await axios.get(url);
      setProducts(response.data.items);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleGetAllProductsClick = () => {
    setSelectedCategory(null);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/category`
      );
      setCategories(response.data.items);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const fetchRetaurants = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/rest`
      );
      setRestaurants(response.data.items);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const handleRestaurantClick = (filteredRestos) => {
    setRestaurants(filteredRestos);
  };

  // const loggedInUserId = Cookies.get("user-id");

  // const fetchUser = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/api/user/${loggedInUserId}`
  //     );
  //     setUser(response.data.user);
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     setIsLoading(false);
  //   }
  // };

  const fetchOrders = async () => {
    try {
      if (orders.length === 0) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/order?page=1&limit=100`
        );
        setOrders(response.data.items);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ProductDataContext.Provider
      value={{
        products,
        handleCategoryClick,
        handleGetAllProductsClick,
        selectedCategory,
        handleRestaurantClick,
        selectedRestaurant,
        categories,
        restaurants,
        fetchRetaurants,
        isLoading,
        cartItems,
        addToCart,
        addToCartPopup,
        removeFromCart,
        clearCart,
        totalPrice,
        editCartItemQuantity,
        user,
        updateUser,
        admin,
        updateAdmin,
        owner,
        updateOwner,
        orders,
        fetchOrders,
      }}
    >
      {children}
    </ProductDataContext.Provider>
  );
}

export { ProductDataContext, ProductDataProvider };

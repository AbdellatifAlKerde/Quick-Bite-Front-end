import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect, createContext } from "react";
import Swal from "sweetalert2";
// Create a new context for the product data
const ProductDataContext = createContext();

function ProductDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState([]);
  const [owner, setOwner] = useState([]);
  const [owners, setOwners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Pagination
  const [productsPage, setProductsPage] = useState(1);
  const [totalProductsPages, setTotalProductsPages] = useState(1);

  const [restaurantsPage, setRestaurantsPage] = useState(1);
  const [totalRestaurantsPages, setTotalRestaurantsPages] = useState(1);

  const [categoriesPage, setCategoriesPage] = useState(1);
  const [totalCategoriesPages, setTotalCategoriesPages] = useState(1);

  const loggedUser = localStorage.getItem("user");
  const loggedAdmin = localStorage.getItem("admin");
  const loggedOwner = localStorage.getItem("owner");

  useEffect(() => {
    // fetchOrders();
    fetchAllOrders();
    fetchProducts();
    fetchAllProducts();
    // fetchCategories();
    fetchAllCategories();
    fetchRetaurants();
    fetchAllRetaurants();
    fetchUsers();
    fetchOwners();

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

  // const fetchProducts = async () => {
  //   setIsLoading(true);
  //   try {
  //     let url = `${process.env.REACT_APP_API_URL}/api/product${
  //       selectedCategory ? `/category/${selectedCategory}` : ""
  //     }`;
  //     const response = await axios.get(url);
  //     setProducts(response.data.items);
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     setIsLoading(false);
  //   }
  // };

  const fetchProducts = async (productsPage) => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/product${
        selectedCategory ? `/category/${selectedCategory}` : ""
      }?page=${productsPage}`;
      // let url = `${process.env.REACT_APP_API_URL}/api/product${
      //   selectedCategory
      //     ? `/category/${selectedCategory}`
      //     : `?page=${productsPage}`
      // }`;

      const response = await axios.get(url);
      const { totalPages } = response.data;
      setProducts(response.data.items);
      setTotalProductsPages(totalPages);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const fetchAllProducts = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/product/all`
      );

      setAllProducts(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(productsPage);
  }, [productsPage]);

  const handleProductsPageChange = (event, newPage) => {
    setProductsPage(newPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchRetaurants(restaurantsPage);
  }, [restaurantsPage]);

  const handleRestaurantsPageChange = (event, newPage) => {
    setRestaurantsPage(newPage);
    window.scrollTo(0, 0);
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

  // const fetchCategories = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/api/category?page=${page}`
  //     );
  //     const { totalPages } = response.data;
  //     setCategories(response.data.items);
  //     setTotalPages(totalPages);
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     setIsLoading(false);
  //   }
  // };

  const fetchAllCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/category/all`
      );
      setAllCategories(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const fetchRetaurants = async (restaurantsPage) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/rest?page=${restaurantsPage}`
      );
      const { totalPages } = response.data;
      setRestaurants(response.data.items);
      setRestaurantsPage(totalPages);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const fetchAllRetaurants = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/rest/all`
      );
      setAllRestaurants(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const deleteRestaurant = async (id) => {
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
            .delete(`${process.env.REACT_APP_API_URL}/api/rest/${id}`)
            .then((response) => {
              fetchRetaurants();
            });
        } catch (error) {
          console.log(error);
        }
        Swal.fire("Deleted!", "Restaurant has been deleted.", "success");
      }
    });
  };

  const handleRestaurantClick = (filteredRestos) => {
    setRestaurants(filteredRestos);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("admin-token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user?page=1&limit=100`,
        config
      );
      setUsers(response.data.items);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
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
            .delete(`${process.env.REACT_APP_API_URL}/api/user/${id}`)
            .then((response) => {
              fetchUsers();
            });
        } catch (error) {
          console.log(error);
        }
        Swal.fire("Deleted!", "Your user has been deleted.", "success");
      }
    });
  };

  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("admin-token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin?page=1&limit=100`,
        config
      );
      setOwners(response.data.items);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const deleteOwner = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--accent-color)",
      cancelButtonColor: "var(--text-color-1)",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios
            .delete(`${process.env.REACT_APP_API_URL}/api/admin/${id}`)
            .then((response) => {
              fetchOwners();
            });
        } catch (error) {
          console.log(error);
        }
        Swal.fire("Deleted!", "Owner has been deleted.", "success");
      }
    });
  };

  // const fetchOrders = async () => {
  //   try {
  //     if (orders.length === 0) {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/api/order?page=${page}`
  //       );
  //       const { totalPages } = response.data;
  //       setOrders(response.data.items);
  //       setTotalPages(totalPages);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const fetchAllOrders = async () => {
    try {
      if (orders.length === 0) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/order/all`
        );
        setAllOrders(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ProductDataContext.Provider
      value={{
        products,
        allProducts,
        handleProductsPageChange,
        productsPage,
        totalProductsPages,
        handleCategoryClick,
        handleGetAllProductsClick,
        selectedCategory,
        handleRestaurantClick,
        selectedRestaurant,
        categories,
        fetchAllCategories,
        allCategories,
        restaurants,
        restaurantsPage,
        totalRestaurantsPages,
        handleRestaurantsPageChange,
        allRestaurants,
        deleteRestaurant,
        isLoading,
        cartItems,
        addToCart,
        addToCartPopup,
        removeFromCart,
        clearCart,
        totalPrice,
        editCartItemQuantity,
        users,
        user,
        updateUser,
        deleteUser,
        admin,
        updateAdmin,
        owner,
        owners,
        fetchOwners,
        deleteOwner,
        updateOwner,
        orders,
        allOrders,
        // fetchOrders,
      }}
    >
      {children}
    </ProductDataContext.Provider>
  );
}

export { ProductDataContext, ProductDataProvider };

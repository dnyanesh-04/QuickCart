'use client';
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Creates a new React Context instance
export const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);


// AppContextProvider component that wraps the application
export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "₹";
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  // State variables to manage products, user data, seller status, and cart items
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // Fetch product list from backend
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        toast.error("No products found");
      }
    } catch (error) {
      toast.error("Product fetch failed: " + error.message);
    }
  };

  // Fetch and sync user data
  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") setIsSeller(true);

      const token = await getToken();

      // Ensure user exists in DB
      await axios.post("/api/user/add", {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
      });

      // Get user data (including cart)
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message || "User data fetch failed");
      }
    } catch (error) {
      toast.error("Fetch user failed: " + error.message);
    }
  };

  // Sync cart to DB
  const syncCart = async (cartData) => {
    if (!user) return;
    try {
      const token = await getToken();
      await axios.post("/api/cart/update", { cartData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Cart sync failed:", error);
      toast.error("Failed to sync cart");
    }
  };

  // Add item to cart
  const addToCart = async (itemId) => {
    const cartData = { ...cartItems };
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    await syncCart(cartData);
    toast.success("Item added successfully!"); 
  };

  // Update quantity or remove item from cart
  const updateCartQuantity = async (itemId, quantity) => {
    const cartData = { ...cartItems };
    if (quantity === 0) {
      delete cartData[itemId];
      toast.success("Item removed");
    } else {
      cartData[itemId] = quantity;
      toast.success("Cart updated");
    }

    setCartItems(cartData);
    await syncCart(cartData);
  };

  // Total items in cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Total cart price
  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
      if (product) {
        total += product.offerPrice * cartItems[id];
      }
    }
    return Math.floor(total * 100) / 100;
  };

  // On mount
  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        getToken,
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        fetchUserData,
        products,
        fetchProductData,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

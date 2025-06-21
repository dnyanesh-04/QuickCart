'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

// Avoids hydration mismatch issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to fetch orders from the API
  // Uses the authentication token to get the user's orders 
  // and updates the state with the fetched orders
  // Handles errors and loading state

  
   const fetchOrders = async () => {
    try {
      const token = await getToken();
      if (!token) return toast.error("Authentication token missing");

      const { data } = await axios.get('/api/order/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when the component mounts and when the user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!isMounted || !user || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const productSummary = order.items
               .map((item) => `${item.product?.name || "Unknown Product"} x ${item.quantity}`)
               .join(", ");

                const formattedDate = new Date(order.date).toLocaleDateString('en-IN');

                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                  >
                    {/* Product summary and icon */}
                    <div className="flex-1 flex gap-5 max-w-80">
                      <Image
                        className="w-16 h-16 object-cover"
                        src={assets.box_icon}
                        alt="box_icon"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-base">{productSummary}</span>
                        <span className="text-gray-500">Items: {totalItems}</span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="text-sm text-gray-800">
                      <p className="font-medium">{order.address.fullName}</p>
                      <p>{order.address.area}</p>
                      <p>{order.address.city}, {order.address.state}</p>
                      <p>{order.address.phoneNumber}</p>
                    </div>

                    {/* Price */}
                    <p className="font-semibold text-base my-auto whitespace-nowrap">
                      {currency}{Number(order.amount).toFixed(2)}

                    </p>

                    {/* Method + Date */}
                    <div className="text-sm text-gray-700 text-right">
                      <p>Method: COD</p>
                      <p>Date: {formattedDate}</p>
                      <p>Payment: Pending</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;

'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";


const Orders = () => {

    const { currency, getToken, user } = useAppContext(); // Fetch required global values and functions from context


    const [orders, setOrders] = useState([]); // State to hold the orders fetched from the API
    const [loading, setLoading] = useState(true); // State to manage loading state

    const fetchSellerOrders = async () => { // Function to fetch seller orders from the API
        try {
            const token = await getToken(); //

            const{ data } = await axios.get('/api/order/seller-orders', {headers: { Authorization: `Bearer ${token}` }});
      
            if(data.success) {
                setOrders(data.orders.reverse()); 
                setLoading(false);

            } else {
                toast.error(data.message); // Show error message if the fetch was not successful
            }
       
        } catch (error) {
            toast.error(error.message); // Handle any errors that occur during the fetch
        }     
}

    useEffect(() => { // Effect to fetch seller orders when the component mounts or when the user changes
        if (user) { 
     fetchSellerOrders(); 
        }
    }, [user]); // Fetch orders when the user changes

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address.fullName}</span>
                                    <br />
                                    <span >{order.address.area}</span>
                                    <br />
                                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                                    <br />
                                    <span>{order.address.phoneNumber}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount}</p>
                            <div>
                                <p className="flex flex-col">
                                    <span>Method : COD</span>
                                    <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                    <span>Payment : Pending</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;
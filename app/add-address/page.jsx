'use client'
import axios from "axios";
import { assets } from "@/assets/assets.js";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import Image from "next/image";
import { useState } from "react";  // To manage input form state
import { useAppContext } from "@/context/AppContext.jsx"; // Custom context (contains auth, routing, etc.)
import toast from "react-hot-toast";

const AddAddress = () => {  // Declare a React functional component called AddAddress
  const { getToken, router } = useAppContext(); // Destructure getToken and router from the custom context AppContext

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    area: '',
    city: '',
    state: '',
  });

  const onSubmitHandler = async (e) => { // Prevent the default browser refresh on form submit
    e.preventDefault();
   
    if (address.pincode.length === 6) {
  // proceed with saving address
    } else {
    toast.error("Pincode must be exactly 6 digits");
  return;
   }

   if (address.phone.length === 10) {
  // proceed with saving address
} else {
  toast.error("Phone no. must be exactly 10 digits");
  return;
}

    try {
      const userToken = await getToken(); // fetch auth token

      if (!userToken) {
        toast.error("User not authenticated");
        return;
      }

      const headers = {  
        Authorization: `Bearer ${userToken}`, 
      };

      console.log("token:", userToken);
      console.log("address:", address);
      console.log("headers:", headers);

      const { data } = await axios.post('/api/user/add-address', { address }, { headers });

      if (data.success) {
        toast.success(data.message);
        router.push('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={onSubmitHandler} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping <span className="font-semibold text-orange-600">Address</span>
          </p>
          <div className="space-y-3 max-w-sm mt-10">
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Full name"
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })} // This updates the fullName dynamically in the state
              value={address.fullName}
            />
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Phone number"
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              value={address.phone}
            />
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Pin code"
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              value={address.pincode}
            />
            <textarea
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
              rows={4}
              placeholder="Address (Area and Street)"
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
              value={address.area}
            ></textarea>
            <div className="flex space-x-3">
              <input
                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                placeholder="City/District/Town"
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                value={address.city}
              />
              <input
                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                placeholder="State"
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                value={address.state}
              />
            </div>
          </div>
          <button
            type="submit"
            className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
          >
            Save address
          </button>
        </form>
        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_location_image}
          alt="my_location_image"
        />
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;

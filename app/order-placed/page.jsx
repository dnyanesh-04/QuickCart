'use client';
import { useRouter } from 'next/navigation';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useEffect } from 'react';

const OrderPlaced = () => {
  const router = useRouter();

    useEffect(() => { //
    const redirectNow = () => { // This function is called after 5 seconds to redirect the user
      console.log("Redirecting to /my-orders...");
      router.push('/my-orders'); // Redirects to the /my-orders page
    };
    const timeout = setTimeout(redirectNow, 5000); // Sets a timeout for 5 seconds before redirecting

    return () => clearTimeout(timeout); // Cleans up the timeout when the component unmounts to prevent memory leaks
  }, [router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt="success" />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">
        Order Placed Successfully
      </div>
      <div className="text-gray-600 text-sm mt-2">Redirecting to My Orders..</div>
    </div>
  );
};

export default OrderPlaced;

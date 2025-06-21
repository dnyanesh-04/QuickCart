import connectDB from '@/config/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Order from '@/models/Order';

export async function GET(request) {
  try { 
    await connectDB();

    const { userId } = getAuth(request); // Get the userId from the request's authentication context
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId }) 
      .sort({ date: -1 }) // Sort orders by date in descending order
      .populate('items.product'); // Populate the product details in each order item

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

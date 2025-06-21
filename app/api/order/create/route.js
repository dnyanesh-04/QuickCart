import connectDB from '@/config/db';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { inngest } from '@/config/inngest';
import User from '@/models/User';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    const { address, items } = await request.json(); // Extracting address and items from the request body

    console.log("Order received from user:", userId);
    console.log("Address:", address);
    console.log("Items:", items);

    if (!userId || !address || !Array.isArray(items) || items.length === 0) {
      console.log("Invalid order data");
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        console.log("Product not found:", item.product);
        return NextResponse.json({ success: false, message: `Product not found: ${item.product}` }, { status: 404 });
      }
      amount += product.offerPrice * item.quantity;
    }

    const totalAmount = amount + Math.floor(amount * 0.02); 

    
    await Order.create({
      userId,
      address, 
      items: await Promise.all(items.map(async (item) => {
  const product = await Product.findById(item.product);
  return {
    product: item.product,
    name: product.name,
    quantity: item.quantity
  };
})),
  amount: totalAmount,
      date: Date.now()
    });

    await inngest.send({
      name: 'order/created',
      data: {
        userId,
        address,
        items,
        amount: totalAmount,
        date: new Date().toISOString()
      }
    });
    
  //Clearing cart items after order creation
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    console.log("Order created and cart cleared.");
    return NextResponse.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

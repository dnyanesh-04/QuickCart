import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller"; // ✅ default import
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId); // ✅ await the promise

    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorized' });
    }

    await connectDB();

    const products = await Product.find({ userId }); // ✅ return only the seller's products
    return NextResponse.json({ success: true, products });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

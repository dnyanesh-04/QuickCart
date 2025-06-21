import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller"; 
import { connect } from "mongoose";
import connectDB from "@/config/db";


export async function GET(request) {
    try{
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId); // Ensure the user is a seller

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        await connectDB();

        const orders = await Order.find({ userId }).populate('address items.product');

        return NextResponse.json({ success: true, orders });

    } catch (error) {
         return NextResponse.json({ success: false, message: error.message });
        }
}

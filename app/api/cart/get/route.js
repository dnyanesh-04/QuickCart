import connectDB from "@/config/db";
import { getAuth } from "@clerk/next.js/server";
import User from '@/models/User.js';
import { NextResponse } from "next/server";


export async function GET(request) { 
    try {

        const {userId} = getAuth(request); 

        await connectDB();
        const user = await User.findById(userId); // Find the user by userId

        const {cartItems} = user; // Extract cartItems from the user document

        return NextResponse.json({ success: true, cartItems });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}


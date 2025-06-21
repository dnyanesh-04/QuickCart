import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from '@/models/User';
import { NextResponse } from "next/server";

export async function GET(request) {
  try { 
    // Get the userId from the request's authentication context
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" });

    await connectDB();
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from '../models/User.js';
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = getAuth(request);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ id: userId });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

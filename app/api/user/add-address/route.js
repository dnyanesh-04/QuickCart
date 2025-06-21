import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    //Get address object from request body
    const body = await request.json();
    const { address } = body;

    await connectDB();

    // Creates a new Address document attaching the userId
    const newAddress = new Address({
      ...address,
      userId,
    });

    await newAddress.save();

    return NextResponse.json({ success: true, message: "Address saved successfully", address: newAddress });

  } catch (error) {
    console.error("Error in POST /api/user/add-address:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { name, email, imageUrl } = await request.json();

        await connectDB();
        let user = await User.findById(userId);

        if (!user) {
            user = new User({
                _id: userId,
                name,
                email,
                imageUrl,
                cartItems: {},
                addresses: [],
            });
            await user.save();
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

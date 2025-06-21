import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import Product from '@/models/Product'; 
import authSeller from '@/lib/authSeller';
import connectDB from '@/config/db'; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId); // Ensure the user is a seller

    if (!isSeller) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }), 
        { status: 403 }
      );
    }

    const formData = await request.formData(); // Use formData to handle file uploads

    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice');
    const files = formData.getAll('images');

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files uploaded' });
    }

    const result = await Promise.all( //  Process each file upload
      files.map(async (file) => { // file can be a Blob or File object
        const arrayBuffer = await file.arrayBuffer(); // Convert file to ArrayBuffer
        const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      })
    );

    const image = result.map((res) => res.secure_url);

    await connectDB();

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image,
      date: Date.now(),
    });

    return NextResponse.json({ success: true, message: 'Product added successfully', newProduct });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

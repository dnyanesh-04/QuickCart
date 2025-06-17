import mongoose from "mongoose";
import { userAgent } from "next/server";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref:"user" }, 
    name: {type: String, required: true},// Clerk user id
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    date: { type: Number, required: true}
})
const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product;
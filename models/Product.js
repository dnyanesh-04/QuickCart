import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User" }, // Reference to the User model
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  date: { type: Number, required: true }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema); // Create the Product model if it doesn't exist

export default Product;

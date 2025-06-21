import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({ // Define the schema for the address
  fullName: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema({ // Define the schema for the User model
  _id: { type: String, required: true }, // Clerk user ID as _id
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  cartItems: { type: Object, default: {} },
  addresses: { type: [addressSchema], default: [] } // Array of addresses
}, { minimize: false }); // Prevent mongoose from removing empty objects
 
export default mongoose.models.User || mongoose.model("User", userSchema); // Create the User model if it doesn't exist

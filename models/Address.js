import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({ // Define the schema for the Address model
    userId: { type:String, required: true },
    fullName: { type: String, required: true },//
    phone: { type: String, required: true },
    pincode: { type: Number, required: true },
    area: { type:String, required: true },
    city: { type:String, required: true }, 
    state: { type:String, required: true },
})

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema); // Create the Address model if it doesn't exist

export default Address; // Export the Address model


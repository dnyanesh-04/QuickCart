import mongoose from 'mongoose'; // Import mongoose to interact with MongoDB

const orderSchema = new mongoose.Schema({ //
    userId: { type: String, required: true, ref: 'User' },
    items: [{
        product: { type: String, required: true, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    date: { type: Number, required: true },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema); // Create the Order model if it doesn't exist

export default Order;
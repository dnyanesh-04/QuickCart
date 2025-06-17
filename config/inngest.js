import { Inngest } from 'inngest';
import connectDB from 'config/db';
import User from '../models/User.js';
import Order from '@/models/Order';

export const inngest = new Inngest({ id: "quickkcart-next" });

// Create user function
export const syncUserCreation = inngest.createFunction(
  { id: 'create-user-with-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const user = event.data;
    const userData = {
      id: user.id,
      email: user.email_addresses?.[0]?.email_address,
      name: `${user.first_name ?? ''} ${user.last_name ?? ''}`,
      imageUrl: user.image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

// Update user function
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-with-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const user = event.data;
    const userData = {
      email: user.email_addresses?.[0]?.email_address,
      name: `${user.first_name ?? ''} ${user.last_name ?? ''}`,
      imageUrl: user.image_url,
    };
    await connectDB();
    await User.findOneAndUpdate({ id: user.id }, userData);
  }
);

// Delete user function
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const user = event.data;
    await connectDB();
    await User.findOneAndDelete({ id: user.id });
  }
)


// Inngest function to create user's order in database
export const createUserOrder = inngest.createFunction(
  {
    id: 'create-user-order',
    batchEvents: {
      maxSize: 25,
      timeout: '5s'
    }
  },
  { event: 'order/created' },
  async ({ events }) => {
    const orders = events.map((event) => {
      return {
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        date: event.data.date
      };
    });

    await connectDB();
    await Order.insertMany(orders);

    return { success: true, processed: orders.length };
  }
);

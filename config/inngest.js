import { Inngest } from 'inngest';
import connectDB from './db';
import User from '@/models/user';

export const inngest = new Inngest({ id: 'quickcart' });

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
);

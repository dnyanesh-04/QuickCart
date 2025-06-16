import { Inngest } from 'inngest';
import connectDB from './db';
import User from '@/models/user';

export const inngest = new Inngest({ id: 'quickcart' });

// Create user function
export const syncUserCreation = inngest.createFunction(
  { id: 'create-user-with-clerk' },
  { event: 'user.created' },  // ✅ updated
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      id: id,  // Store Clerk user id separately
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

// Update user
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-with-clerk' },
  { event: 'user.updated' },  // ✅ updated
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findOneAndUpdate({ id: id }, userData);
  }
);

// Delete user
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'user.deleted' },  // ✅ updated
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findOneAndDelete({ id: id });
  }
);

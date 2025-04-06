// pages/api/users/delete-user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/utils/db';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { method } = req;

  switch (method) {
    case 'DELETE': {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'Missing or invalid user ID' });
      }

      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ success: false, message: (error as Error).message });
      }
    }

    case 'PUT': {
      const { id, updateData } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'Missing or invalid user ID' });
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user: updatedUser });
      } catch (error) {
        return res.status(500).json({ success: false, message: (error as Error).message });
      }
    }

    default:
      res.setHeader('Allow', ['DELETE', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
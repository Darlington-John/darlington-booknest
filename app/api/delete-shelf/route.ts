import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(request: NextRequest) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Parse the request body to get the shelfId
    const { shelfId } = await request.json();

    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the JWT and extract the user ID
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    // Connect to MongoDB
    await connectMongo();

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove the shelf with the specified shelfId
    user.shelves = user.shelves.filter((shelf: any) => String(shelf._id) !== String(shelfId));

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: 'Shelf deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting shelf:', error);
    return NextResponse.json({ message: 'Error deleting shelf' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Parse the request body
    const { name, description } = await req.json();

    // Ensure both fields are present
    if (!name || !description) {
      return NextResponse.json({ error: 'Both name and description are required' }, { status: 400 });
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the JWT and extract the user ID
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    // Connect to MongoDB
    await connectMongo();

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add the new shelf to the user's shelves array
    user.shelves.push({
      name: name,
      description: description,
      books: [], // Initialize with an empty array
    });

    // Save the user document
    await user.save();

    return NextResponse.json({ message: 'Shelf added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding shelf:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

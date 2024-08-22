// app/api/update-name/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET  as string;

export async function PUT(req: NextRequest) {
  try {
    await connectMongo();

    // Get the token from the Authorization header
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Parse the request body to get the new name and surname
    const { firstName, lastName } = await req.json();

    // Find the user by ID and update their name and surname
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true } // This option returns the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Name updated successfully', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while updating name' }, { status: 500 });
  }
}

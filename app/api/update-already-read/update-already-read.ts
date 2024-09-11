// src/app/api/update-already-read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    // Ensure JWT_SECRET is defined
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Connect to MongoDB
    await connectMongo();

    // Parse the request body to get the book URL
    const { url }: { url: string } = await req.json();

    // Extract the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Find the user by their ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure the URL is provided
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Add the book URL to the user's alreadyRead array
    (user.alreadyRead as any).push({ url });
    await user.save();

    // Return a success response
    return NextResponse.json({ message: 'Book added to already read' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in update-already-read route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

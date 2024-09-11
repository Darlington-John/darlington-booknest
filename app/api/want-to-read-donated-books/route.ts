import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Ensure JWT_SECRET is defined
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Connect to MongoDB
    await connectMongo();

    // Parse the request body to get the book data
    const { book } = await req.json();

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

    // Ensure the book object contains the required 'coverImage' field
    const requiredFields = ['title', 'pdf', 'author','coverImage', 'pageCount', 'donatedBy'];
    const missingFields = requiredFields.filter(field => !book[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // Check if the book is already in the `toRead` array
    const isBookInToRead = user.toRead.some((b: { coverImage: string }) => b.coverImage === book.coverImage);
    if (isBookInToRead) {
      return NextResponse.json({ message: 'Book is already in the toRead list' }, { status: 200 });
    }

    // Remove the book from `currentlyReading` if it exists there
    user.currentlyReading = user.currentlyReading.filter((b: { coverImage: string }) => b.coverImage !== book.coverImage);

    // Remove the book from `alreadyRead` if it exists there
    user.alreadyRead = user.alreadyRead.filter((b: { coverImage: string }) => b.coverImage !== book.coverImage);

    // Add the book to the `toRead` array
    user.toRead.push(book);

    // Save the updated user document
    await user.save();

    // Return a success response
    return NextResponse.json({ message: 'Book added to want to read' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in to-read route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { Book } from '~/models/User';

import connectMongo from '~/lib/mongodb';
import mongoose from 'mongoose';
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    await connectMongo();

    const { bookId, rating } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    const userId = (user as { _id: mongoose.Types.ObjectId | string })._id;
    
    const existingRating = book.ratings.find(r => r.userId.toString() === userId.toString());
    if (existingRating) {
      existingRating.rating = rating; 
    } else {
      
      book.ratings.push({ userId, rating } as any);
    }

    await book.save();

    return NextResponse.json({ message: 'Rating submitted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error submitting rating:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

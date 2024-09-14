import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import jwt from 'jsonwebtoken';
import { Book } from '~/models/User';


const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const { bookId, comment, firstName, lastName, profile } = await req.json(); 

    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, firstName: string, lastName: string, profile: string };

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    
    book.reviews.push({
      userId: decoded.userId as any,
      firstName,  
      lastName,    
      profile,      
      comment,
      date: new Date(),              
      likes: [],
      dislikes: [],
    });

    
    await book.save();

    
    const populatedBook = await Book.findById(bookId)
      .populate({
        path: 'reviews.userId',
        select: 'name profile',  
      });

    
    const latestReview = populatedBook?.reviews[populatedBook?.reviews.length - 1];

    return NextResponse.json({ message: 'Review added successfully', latestReview }, { status: 200 });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    
    await connectMongo();

    
    const { book } = await req.json();

    
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

    
    const requiredFields = ['title', 'pdf', 'author','coverImage', 'pageCount', 'donatedBy'];
    const missingFields = requiredFields.filter(field => !book[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    
    const isBookInToRead = user.toRead.some((b: { coverImage: string }) => b.coverImage === book.coverImage);
    if (isBookInToRead) {
      return NextResponse.json({ message: 'Book is already in the toRead list' }, { status: 200 });
    }

    
    user.currentlyReading = user.currentlyReading.filter((b: { coverImage: string }) => b.coverImage !== book.coverImage);

    
    user.alreadyRead = user.alreadyRead.filter((b: { coverImage: string }) => b.coverImage !== book.coverImage);

    
    user.toRead.push(book);

    
    await user.save();

    
    return NextResponse.json({ message: 'Book added to want to read' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in to-read route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

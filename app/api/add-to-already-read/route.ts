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

    const { url } = await req.json();
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

    
    user.currentlyReading = user.currentlyReading.filter(book => book.url !== url);

    
    const isAlreadyRead = user.alreadyRead.some(book => book.url === url);

    
    if (!isAlreadyRead) {
      (user.alreadyRead as any).push({ url });
    }

    await user.save();

    return NextResponse.json({ message: 'Book processed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in add-to-already-read route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

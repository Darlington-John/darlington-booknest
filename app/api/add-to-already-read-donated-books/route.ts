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

    // Destructure all fields from the request body
    const { name, url, pdf, title, author, donatedPdf, coverImage, pageCount, donatedBy } = await req.json();

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

    // Remove the book from `currentlyReading` if it exists
    user.currentlyReading = user.currentlyReading.filter(book => book.coverImage !== coverImage);

    // Check if the book is already in `alreadyRead`
    const isAlreadyRead = user.alreadyRead.some(book => book.coverImage === coverImage);

    // Add the book to `alreadyRead` only if it's not already there
    if (!isAlreadyRead) {
      user.alreadyRead.push({
        name,
        url,
        pdf,
        title,
        author,
        donatedPdf,
        coverImage,
        pageCount,
        donatedBy,
      });
    }

    await user.save();

    return NextResponse.json({ message: 'Book processed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in add-to-already-read route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

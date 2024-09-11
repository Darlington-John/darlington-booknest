// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import { Book } from '~/models/User';


export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    // Fetch all books
    const books = await Book.find();

    if (!books) {
      return NextResponse.json({ error: 'No books found' }, { status: 404 });
    }

    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

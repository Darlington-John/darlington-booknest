import { NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import { Book } from '~/models/User';

export async function GET(req: Request) {
    try {
      await connectMongo();
  
      // Get userId from the headers
      const userId = req.headers.get('user-id');
  
      if (!userId) {
        return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
      }
  
      // Fetch books donated by the user
      const donatedBooks = await Book.find({ donatedBy: userId });
  
      if (donatedBooks.length === 0) {
        return NextResponse.json({ error: 'No donated books found' }, { status: 404 });
      }
  
      return NextResponse.json({ books: donatedBooks });
    } catch (error) {
      console.error('Error fetching donated books:', error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  }
  
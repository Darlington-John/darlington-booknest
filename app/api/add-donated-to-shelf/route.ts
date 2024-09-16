
import { NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

export async function POST(req: Request) {
  await connectMongo();

  const { shelfId, book }: any = await req.json();
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await User.findOne({ 'shelves._id': shelfId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const shelf = (user.shelves as any).id(shelfId);
    if (shelf) {
      shelf.books.push(book);
      await user.save();
      return NextResponse.json({ message: 'Book added to shelf' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Shelf not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

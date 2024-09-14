
import connectMongo from '~/lib/mongodb';
import { notFound } from 'next/navigation';
import { Book } from '~/models/User';
import BookPage from '~/app/dashboard/components/book-details';

export default async function DonatedBookPage({ params }: any) {
  const { bookId } = params;

  await connectMongo();

  const book = await Book.findById(bookId).lean();

  if (!book) {
    notFound();
  }
  const cleanBook = JSON.parse(JSON.stringify(book));
  return (

            <BookPage book={cleanBook} />
    
  );
}

import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import connectMongo from '~/lib/mongodb';
// Update with your Book model
import jwt from 'jsonwebtoken';
import { Book } from '~/models/User';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const author = formData.get('author');
    const description = formData.get('description');
    const pageCount = formData.get('pageCount');
    const aboutAuthor = formData.get('aboutAuthor');
    const genres = JSON.parse(formData.get('genres') as string);
    const pdfFile = formData.get('pdf') as File | null;
    const coverImageFile = formData.get('coverImage') as File | null;
    const authorProfileFile = formData.get('authorProfile') as File | null;
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    const uploadFile = async (file: File | null, folder: string) => {
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        return new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder },
            (error, result) => {
              if (error) {
                reject(new Error(error.message || 'Upload failed'));
              } else {
                resolve(result as { secure_url: string });
              }
            }
          );
          uploadStream.end(buffer);
        });
      }
      throw new Error('No file uploaded or incorrect format');
    };

    const pdfUploadResult = pdfFile ? await uploadFile(pdfFile, 'books/pdfs') : { secure_url: '' };
    const coverImageUploadResult = coverImageFile ? await uploadFile(coverImageFile, 'books/covers') : { secure_url: '' };
    const authorProfileUploadResult = authorProfileFile ? await uploadFile(authorProfileFile, 'books/authors') : { secure_url: '' };

    await connectMongo();

    const newBook = await Book.create({
      title,
      author,
      description,
      pageCount,
      aboutAuthor,
      genres,
      pdf: pdfUploadResult.secure_url,
      coverImage: coverImageUploadResult.secure_url,
      authorProfile: authorProfileUploadResult.secure_url,
      donatedBy: userId,
    });

    return NextResponse.json({
      pdfUrl: pdfUploadResult.secure_url,
      coverImageUrl: coverImageUploadResult.secure_url,
      authorProfileUrl: authorProfileUploadResult.secure_url,
      bookId: newBook._id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
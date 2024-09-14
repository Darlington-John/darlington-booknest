
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET  as string;

export async function PUT(req: NextRequest) {
  try {
    await connectMongo();

    
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    
    const { firstName, lastName } = await req.json();

    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Name updated successfully', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while updating name' }, { status: 500 });
  }
}

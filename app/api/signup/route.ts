import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';



export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { firstName, lastName, email, password } = await req.json();

    console.log('Received data:', { firstName, lastName, email, password });

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error during sign up:', error);
    return NextResponse.json({ error: 'An error occurred during sign up' }, { status: 500 });
  }
}

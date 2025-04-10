// app/api/users/check-password-age/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/User';
import connect from '@/utils/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    await connect();

    const user = await User.findOne({ email }).select('lastPasswordReset');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if password was changed within last 24 hours
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const tooRecent = user.lastPasswordReset 
      ? Date.now() - new Date(user.lastPasswordReset).getTime() < oneDayInMs
      : false;

    return NextResponse.json(
      { 
        tooRecent,
        lastChanged: user.lastPasswordReset 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error checking password age:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {}

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('❌ F3HIM CREATE: Missing or invalid auth header');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('🔑 F3HIM CREATE: Received token (first 20 chars):', token.substring(0, 20) + '...');
    
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ success: false, error: 'Auth unavailable' }, { status: 500 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
      console.log('✅ F3HIM CREATE: Token verified for UID:', decodedToken.uid);
    } catch (err: any) {
      console.error('❌ F3HIM CREATE: Token verification failed');
      console.error('❌ F3HIM CREATE: Error code:', err?.code);
      console.error('❌ F3HIM CREATE: Error message:', err?.message);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token',
        details: err?.message || 'Token verification failed'
      }, { status: 401 });
    }

    const firebaseId = decodedToken.uid;
    const email = decodedToken.email || undefined;
    const displayName = decodedToken.name || undefined;
    const picture = decodedToken.picture || undefined;

    // Parse displayName into firstName/lastName if available
    const nameParts = displayName?.split(' ') || [];
    const firstName = nameParts[0] || undefined;
    const lastName = nameParts.slice(1).join(' ').trim() || undefined;

    // Upsert F3HIM
    console.log('👤 F3HIM CREATE: Upserting F3HIM with firebaseId:', firebaseId);
    let f3him;
    try {
      f3him = await prisma.f3HIM.upsert({
        where: { firebaseId },
        update: {
          // Sync Firebase data on update
          email: email || undefined,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          photoURL: picture || undefined,
        },
        create: {
          firebaseId,
          email: email || body.email || undefined,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          photoURL: picture || undefined,
        },
      });
      console.log('✅ F3HIM CREATE: F3HIM found/created:', f3him.id);
    } catch (err: any) {
      console.error('❌ F3HIM CREATE: F3HIM upsert failed:', err);
      console.error('❌ F3HIM CREATE: Error code:', err?.code);
      console.error('❌ F3HIM CREATE: Error meta:', err?.meta);
      throw new Error(`F3HIM creation failed: ${err?.message || 'Unknown error'}`);
    }

    // Format response
    return NextResponse.json({
      success: true,
      message: 'F3HIM found or created',
      f3himId: f3him.id,
      data: {
        id: f3him.id,
        firebaseId: f3him.firebaseId,
        email: f3him.email,
        firstName: f3him.firstName,
        lastName: f3him.lastName,
        f3Handle: f3him.f3Handle,
        photoURL: f3him.photoURL,
      },
    });
  } catch (err: any) {
    console.error('❌ F3HIM CREATE: Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: err?.message || 'Unknown error',
    }, { status: 500 });
  }
}


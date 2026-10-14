import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting map (IP -> timestamps[])
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Clean up older timestamps
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. Identify IP address for anti-spam rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-client';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak permintaan (Rate limit exceeded). Coba lagi dalam 1 menit.' },
        { status: 429 }
      );
    }

    // 2. Validate slug parameter
    const slug = params.slug;
    if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug) || slug.length > 120) {
      return NextResponse.json(
        { success: false, error: 'Slug tidak valid' },
        { status: 400 }
      );
    }

    // 3. Validate body payload
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const type = body.type;
    if (type !== 'yes' && type !== 'no') {
      return NextResponse.json(
        { success: false, error: 'Type feedback hanya diperbolehkan "yes" atau "no"' },
        { status: 400 }
      );
    }

    // Return sanitized success response
    return NextResponse.json({
      success: true,
      slug,
      recordedType: type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
  }
}


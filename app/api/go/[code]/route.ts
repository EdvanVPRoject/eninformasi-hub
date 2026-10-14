import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Database of affiliate redirection targets
  const affiliateMap: Record<string, string> = {
    'vps-cloud': 'https://www.digitalocean.com',
    'gpu-rtx4090': 'https://www.tokopedia.com',
    'router-wifi6': 'https://www.tokopedia.com',
    'keychron-keyboard': 'https://www.tokopedia.com',
    'tablet-eink': 'https://www.tokopedia.com',
    'mac-mini-m4': 'https://www.apple.com',
  };

  const targetUrl = affiliateMap[code];

  if (!targetUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // In production: record click count asynchronously before redirecting
  return NextResponse.redirect(targetUrl, 302);
}

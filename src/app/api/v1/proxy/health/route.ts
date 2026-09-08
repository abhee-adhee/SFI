import { NextRequest, NextResponse } from 'next/server';
import { getFlag } from '@/lib/secrets';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload.target !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid target parameter' }, { status: 400 });
    }

    const targetUrl = payload.target;

    // WEB-05: Flawed URL validation allowing SSRF
    // The validation attempts to ensure the URL points to dc-europe.nexus.local
    // However, it uses a loose regex that allows characters like '#' or '?' to bypass it.
    // E.g. https://core-internal.nexus.local#dc-europe.nexus.local
    const allowedSuffix = "dc-europe.nexus.local";
    const validator = new RegExp(`^https?:\\/\\/.*${allowedSuffix}.*`);

    if (!validator.test(targetUrl)) {
      return NextResponse.json({ error: 'Target not in allowed datacenter domain' }, { status: 403 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch (_e) {
      return NextResponse.json({ error: 'Malformed URL' }, { status: 400 });
    }

    const host = parsedUrl.hostname;

    // Simulated internal network routing. We do not actually call fetch().
    // This strictly isolates the challenge and prevents real SSRF.
    if (host === 'dc-europe.nexus.local') {
      return NextResponse.json({
        status: 'online',
        host: host,
        latency: '34ms',
        datacenter: 'EU-West'
      }, { status: 200 });
    }

    if (host === 'core-internal.nexus.local') {
      // The simulated internal service that should not be reachable externally
      if (parsedUrl.pathname === '/diagnostics') {
        return NextResponse.json({
          status: 'restricted_access_granted',
          host: host,
          message: 'Internal Core Diagnostics',
          flag: getFlag('WEB-05')
        }, { status: 200 });
      }
      return NextResponse.json({ error: 'Not found on internal core' }, { status: 404 });
    }

    // Default response for any other bypassed host to simulate DNS failure
    return NextResponse.json({ error: `NXDOMAIN: Could not resolve ${host}` }, { status: 502 });

  } catch (_e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getFlag } from '@/lib/secrets';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!payload || !payload.node) {
      return NextResponse.json({ error: 'Missing node parameter' }, { status: 400 });
    }

    // WEB-04: Type Juggling / Normalization discrepancy
    // Validation Layer (Strict checking on string)
    if (typeof payload.node === 'string') {
      if (payload.node.toUpperCase() === 'GHOST') {
        return NextResponse.json({ error: 'SECURITY ALERT: Unrecognized node identity blocked.' }, { status: 403 });
      }
    } else if (typeof payload.node !== 'object') {
      // Allow object (like arrays) through the validator, assuming it will be rejected later if invalid.
      // A strict validator would block arrays here, but this is the vulnerability.
      return NextResponse.json({ error: 'Invalid node type' }, { status: 400 });
    }

    // Processing Layer (Loose normalization)
    // Coerces array ['GHOST'] into string "GHOST"
    const processedNode = String(payload.node).toUpperCase();

    if (processedNode === 'GHOST') {
      // Exploit successful
      return NextResponse.json({
        status: 'accepted',
        receipt: `Telemetry from ${processedNode} registered.`,
        diagnostic_data: getFlag('WEB-04')
      }, { status: 200 });
    }

    // Normal behavior
    return NextResponse.json({
      status: 'accepted',
      receipt: `Telemetry from ${processedNode} registered.`
    }, { status: 200 });
    
  } catch (_e) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}

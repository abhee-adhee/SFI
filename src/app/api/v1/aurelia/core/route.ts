import { NextResponse } from 'next/server';
import { getFlag } from '@/lib/secrets';

export async function GET() {
  return NextResponse.json({
    status: 'RESTRICTED',
    system: 'AURELIA_CORE_ENGINE',
    diagnostic_interface: '/aurelia/core',
    active_component: 'AURELIA-CORE-V4',
    required_state_token_format: '32-byte SHA256 hex string'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (action === 'inspect') {
      return NextResponse.json({
        status: 'READY',
        system: 'AURELIA_CORE_ENGINE',
        module_id: 'AURELIA-CORE-V4'
      });
    }

    if (action === 'verify') {
      const expectedToken = '8d2efcc213b3f8f35e859b62c458744399be773f9d1632585c51d6721d6a0d0c';
      if (token && token.trim().toLowerCase() === expectedToken) {
        const flag = getFlag('BOSS-01');
        return NextResponse.json({
          success: true,
          status: 'AUTHENTICATED',
          message: 'AURELIA Core diagnostic state reconstructed successfully.',
          flag: flag
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid state token. Verification failed.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Supported actions: inspect, verify' },
      { status: 400 }
    );
  } catch (_e) {
    return NextResponse.json(
      { success: false, error: 'Malformed request body.' },
      { status: 400 }
    );
  }
}

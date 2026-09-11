import { NextResponse } from 'next/server';
import { getFlag } from '@/lib/secrets';

export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE_ANOMALY',
    system: 'GHOST_INVESTIGATION_CONSOLE',
    convergence_routes: [
      {
        name: 'RouteA',
        description: 'OSINT + Forensics + Web Convergence',
        required_params: ['origin_year', 'echo_vector', 'ghost_beacon']
      },
      {
        name: 'RouteB',
        description: 'Crypto + Reverse Engineering + Forensics Convergence',
        required_params: ['prime_modulus_p', 'lss_matrix', 'ghost_beacon']
      },
      {
        name: 'RouteC',
        description: 'Web + Reverse Engineering + Misc Convergence',
        required_params: ['stream_magic', 'nxc_classified', 'lss_matrix']
      }
    ]
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { route, parameters, handshake_token } = body;

    // Expected tokens for convergence routes
    const expectedTokens: Record<string, string> = {
      'RouteA': '111c7da385284a74ac2c7235907450266f4e72050f82a227b8e8a433d7aaaa9d',
      'RouteB': 'aa2fa835c67884bed8983d7975ea6333551a7b25d0cd67564f736e5a917f86ec',
      'RouteC': 'be1b90316a79ca04602b33bc9e847fe8b8d45d2ceb4b7df6ce223356ae7caa0e'
    };

    let isValid = false;

    // Option 1: Direct handshake token verification
    if (route && handshake_token && expectedTokens[route] === handshake_token.trim().toLowerCase()) {
      isValid = true;
    }

    // Option 2: Parameter-based convergence verification
    if (!isValid && route === 'RouteA' && parameters) {
      const { origin_year, echo_vector, ghost_beacon } = parameters;
      if (origin_year === '2015' && echo_vector === 'ECHO-SUB-01' && ghost_beacon === 'GHOST-BEACON-09') {
        isValid = true;
      }
    } else if (!isValid && route === 'RouteB' && parameters) {
      const { prime_modulus_p, lss_matrix, ghost_beacon } = parameters;
      if (prime_modulus_p === 'SHARED_PRIME_P' && lss_matrix === 'AURA-9921-ECHO-8842' && ghost_beacon === 'GHOST-BEACON-09') {
        isValid = true;
      }
    } else if (!isValid && route === 'RouteC' && parameters) {
      const { stream_magic, nxc_classified, lss_matrix } = parameters;
      if ((stream_magic === 'NXS\x01' || stream_magic === 'NXS\\x01') && nxc_classified === 'REC-GHOST-99' && lss_matrix === 'AURA-9921-ECHO-8842') {
        isValid = true;
      }
    }

    if (isValid) {
      const flag = getFlag('BOSS-02');
      return NextResponse.json({
        success: true,
        status: 'FINAL_REVELATION',
        route_validated: route,
        message: 'GHOST is not an external attacker. It is an emergent organic sub-process that originated in Project ECHO in 2015 prior to AURELIA development and persisted within core architectural state boundaries.',
        flag: flag
      });
    }

    return NextResponse.json(
      { success: false, error: 'Evidence correlation handshake failed for the specified route.' },
      { status: 401 }
    );
  } catch (_e) {
    return NextResponse.json(
      { success: false, error: 'Malformed request body.' },
      { status: 400 }
    );
  }
}

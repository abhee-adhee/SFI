import { NextRequest, NextResponse } from 'next/server';
import { getFlag } from '@/lib/secrets';
import systems from '@/data/systems.json';

export async function GET(request: NextRequest) {
  const diagnosticMode = request.headers.get('x-diagnostic-mode');

  // WEB-02: Header manipulation for degraded diagnostics
  if (diagnosticMode === 'enabled') {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        global_status: 'DEGRADED',
        diagnostic_dump: {
          memory_faults: 34,
          network_latency: '140ms',
          anomaly_signature: getFlag('WEB-02'),
          systems_affected: ['SYS-AURELIA']
        }
      },
      { 
        status: 200,
        headers: {
          'X-Diagnostic-Mode': 'active'
        }
      }
    );
  }

  // Normal behavior
  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      global_status: 'OPERATIONAL',
      systems
    },
    { 
      status: 200,
      headers: {
        // Clue for the participant to notice the header
        'X-Diagnostic-Mode': 'disabled'
      }
    }
  );
}

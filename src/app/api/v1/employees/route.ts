import { NextRequest, NextResponse } from 'next/server';
import { getMockSession } from '@/lib/auth';
import { getFlag } from '@/lib/secrets';
import characters from '@/data/characters.json';

export async function GET(request: NextRequest) {
  const session = getMockSession(request);
  const url = new URL(request.url);
  const debugMode = url.searchParams.get('debug') === 'true' || url.searchParams.get('include_metadata') === 'true';

  // WEB-01: Expose internal data if a specific undocumented query param is set
  if (debugMode) {
    const exposedCharacters = characters.map(c => {
      // Return normal char data plus mock internal developer metadata
      const meta = {
        last_modified: '2026-08-01T10:00:00Z',
        admin_notes: c.id === 'EMP-001' ? `Dr. Vance's profile is locked. Root access token is ${getFlag('WEB-01')}` : 'No notes.'
      };
      return { ...c, _internal_meta: meta };
    });

    return NextResponse.json(exposedCharacters, { status: 200 });
  }

  // Normal behavior
  if (session.state === 'anonymous') {
    return NextResponse.json(
      characters.map(c => ({ id: c.id, name: c.name, role: c.role })),
      { status: 200 }
    );
  }

  // Employee or higher gets standard full info (but not the _internal_meta)
  return NextResponse.json(characters, { status: 200 });
}

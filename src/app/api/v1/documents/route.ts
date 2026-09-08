import { NextRequest, NextResponse } from 'next/server';
import { getMockSession } from '@/lib/auth';
import documents from '@/data/documents.json';

export async function GET(request: NextRequest) {
  const session = getMockSession(request);
  const url = new URL(request.url);
  const docId = url.searchParams.get('id');

  if (docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (doc.classification === 'PUBLIC') {
      return NextResponse.json(doc, { status: 200 });
    }

    if (session.state === 'anonymous') {
      return NextResponse.json({ error: 'Clearance required' }, { status: 403 });
    }

    // Mock vulnerability: IDOR or missing check if session state is 'employee' trying to access 'RESTRICTED' doc
    // (We allow it if the challenge demands it later, for now just basic auth)
    if (doc.classification === 'RESTRICTED' && !['internal', 'security', 'admin'].includes(session.state)) {
      return NextResponse.json({ error: 'Elevated clearance required' }, { status: 403 });
    }

    return NextResponse.json(doc, { status: 200 });
  }

  // List all documents based on clearance
  if (session.state === 'anonymous') {
    return NextResponse.json(
      documents.filter(d => d.classification === 'PUBLIC'),
      { status: 200 }
    );
  }

  return NextResponse.json(documents, { status: 200 });
}

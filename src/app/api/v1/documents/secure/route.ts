import { NextRequest, NextResponse } from 'next/server';
import { getMockSession } from '@/lib/auth';
import { getFlag } from '@/lib/secrets';
import documents from '@/data/documents.json';

export async function GET(request: NextRequest) {
  const session = getMockSession(request);
  const url = new URL(request.url);
  
  // Retrieve all 'id' parameters. NextRequest searchParams handles duplicates natively.
  // e.g., ?id=DOC-001&id=DOC-004
  const ids = url.searchParams.getAll('id');

  if (ids.length === 0) {
    return NextResponse.json({ error: 'Missing document id' }, { status: 400 });
  }

  // VULNERABILITY (WEB-03): HTTP Parameter Pollution + IDOR mismatch.
  // The authorization validator carelessly checks only the first parameter...
  const idToValidate = ids[0];
  const docToValidate = documents.find(d => d.id === idToValidate);

  if (!docToValidate) {
    return NextResponse.json({ error: 'Document not found (validation phase)' }, { status: 404 });
  }

  if (['RESTRICTED', 'ARCHIVED'].includes(docToValidate.classification) && !['internal', 'security', 'admin'].includes(session.state)) {
    return NextResponse.json({ error: `Unauthorized: Clearance required for ${docToValidate.id}` }, { status: 403 });
  }

  // ...but the backend retriever carelessly uses the last parameter provided.
  const idToFetch = ids[ids.length - 1];
  const docToFetch = documents.find(d => d.id === idToFetch);

  if (!docToFetch) {
    return NextResponse.json({ error: 'Document not found (retrieval phase)' }, { status: 404 });
  }

  // If they successfully fetched DOC-004 using the mismatch, append the flag.
  if (docToFetch.id === 'DOC-004' && idToValidate !== 'DOC-004') {
    return NextResponse.json({
      ...docToFetch,
      _recovered_flag: getFlag('WEB-03')
    }, { status: 200 });
  }

  // Normal behavior
  return NextResponse.json(docToFetch, { status: 200 });
}

import { NextRequest } from 'next/server';

export type AuthState = 'anonymous' | 'employee' | 'internal' | 'security' | 'admin';

export interface MockSession {
  state: AuthState;
  userId: string | null;
}

export function getMockSession(request: NextRequest): MockSession {
  // In Phase 3A, this is a conceptual mock abstraction.
  // It checks for a 'X-Mock-Role' header or a mock bearer token.
  
  const authHeader = request.headers.get('authorization');
  const roleHeader = request.headers.get('x-mock-role');
  
  let role: AuthState = 'anonymous';
  let userId: string | null = null;

  if (authHeader) {
    if (authHeader === 'Bearer employee_token') role = 'employee';
    if (authHeader === 'Bearer internal_token') role = 'internal';
    if (authHeader === 'Bearer security_token') role = 'security';
    if (authHeader === 'Bearer admin_token') role = 'admin';
  } else if (roleHeader) {
    if (['anonymous', 'employee', 'internal', 'security', 'admin'].includes(roleHeader)) {
      role = roleHeader as AuthState;
    }
  }

  // Very simple mocked identity bindings for later Web challenges
  if (role === 'admin') userId = 'EMP-001';
  else if (role === 'security') userId = 'EMP-004';
  else if (role === 'employee') userId = 'EMP-007';

  return {
    state: role,
    userId
  };
}

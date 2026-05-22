import type { IncomingMessage, ServerResponse } from 'node:http';

export type TestimonialStatus = 'pending' | 'approved';

export type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  quote: string;
  status: TestimonialStatus;
  created_at?: string;
};

const blockedWords = [
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'dick',
  'pussy',
  'slut',
  'whore',
  'nigger',
  'faggot',
];

export function hasBlockedLanguage(value: string) {
  return blockedWords.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(value));
}

export function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) as T : {} as T;
}

export function requireAdmin(req: IncomingMessage) {
  const expectedToken = process.env.ADMIN_TOKEN;
  const receivedToken = req.headers['x-admin-token'];

  return Boolean(
    expectedToken
      && typeof receivedToken === 'string'
      && receivedToken === expectedToken,
  );
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return {
    restUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/testimonials`,
    serviceRoleKey,
  };
}

export async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { restUrl, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${restUrl}${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as T;
}

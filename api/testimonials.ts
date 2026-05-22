import type { VercelRequest, VercelResponse } from '@vercel/node';

type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  quote: string;
  status: 'pending' | 'approved';
  created_at?: string;
};

type NewTestimonialBody = {
  name?: string;
  role?: string;
  quote?: string;
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

function hasBlockedLanguage(value: string) {
  return blockedWords.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(value.toLowerCase()));
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel.');
  }

  return {
    restUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/testimonials`,
    serviceRoleKey,
  };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const testimonials = await supabaseRequest<TestimonialRecord[]>(
        '?select=id,name,role,quote,status,created_at&status=eq.approved&order=created_at.desc',
      );

      return res.status(200).json({ testimonials });
    }

    if (req.method === 'POST') {
      const body = req.body as NewTestimonialBody;
      const name = body.name?.trim() ?? '';
      const role = body.role?.trim() || 'Visitor';
      const quote = body.quote?.trim() ?? '';

      if (!name || !quote) {
        return res.status(400).json({ message: 'Name and comment are required.' });
      }

      if (name.length > 80 || role.length > 80 || quote.length > 500) {
        return res.status(400).json({ message: 'Please shorten your testimonial.' });
      }

      if (hasBlockedLanguage(`${name} ${role} ${quote}`)) {
        return res.status(400).json({ message: 'Please remove inappropriate language before submitting.' });
      }

      const [testimonial] = await supabaseRequest<TestimonialRecord[]>('', {
        method: 'POST',
        body: JSON.stringify({
          id: `user-${Date.now()}`,
          name,
          role,
          quote,
          status: 'pending',
        }),
      });

      return res.status(201).json({ testimonial });
    }

    return res.status(405).json({ message: 'Method not allowed.' });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

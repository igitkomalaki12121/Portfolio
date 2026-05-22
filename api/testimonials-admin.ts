import type { VercelRequest, VercelResponse } from '@vercel/node';

type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  quote: string;
  status: 'pending' | 'approved';
  created_at?: string;
};

type AdminBody = {
  id?: string;
};

function requireAdmin(req: VercelRequest) {
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
    if (!requireAdmin(req)) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    if (req.method === 'GET') {
      const testimonials = await supabaseRequest<TestimonialRecord[]>(
        '?select=id,name,role,quote,status,created_at&status=eq.pending&order=created_at.desc',
      );

      return res.status(200).json({ testimonials });
    }

    if (req.method === 'PATCH') {
      const body = req.body as AdminBody;

      if (!body.id) {
        return res.status(400).json({ message: 'Testimonial id is required.' });
      }

      const [testimonial] = await supabaseRequest<TestimonialRecord[]>(
        `?id=eq.${encodeURIComponent(body.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: 'approved' }),
        },
      );

      return res.status(200).json({ testimonial });
    }

    if (req.method === 'DELETE') {
      const body = req.body as AdminBody;

      if (!body.id) {
        return res.status(400).json({ message: 'Testimonial id is required.' });
      }

      await supabaseRequest<void>(`?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'DELETE',
      });

      return res.status(200).json({ message: 'Deleted.' });
    }

    return res.status(405).json({ message: 'Method not allowed.' });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

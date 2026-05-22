import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  hasBlockedLanguage,
  readJsonBody,
  sendJson,
  supabaseRequest,
  type TestimonialRecord,
} from './_supabase';

type NewTestimonialBody = {
  name?: string;
  role?: string;
  quote?: string;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (req.method === 'GET') {
      const testimonials = await supabaseRequest<TestimonialRecord[]>(
        '?select=id,name,role,quote,status,created_at&status=eq.approved&order=created_at.desc',
      );

      sendJson(res, 200, { testimonials });
      return;
    }

    if (req.method === 'POST') {
      const body = await readJsonBody<NewTestimonialBody>(req);
      const name = body.name?.trim() ?? '';
      const role = body.role?.trim() || 'Visitor';
      const quote = body.quote?.trim() ?? '';

      if (!name || !quote) {
        sendJson(res, 400, { message: 'Name and comment are required.' });
        return;
      }

      if (name.length > 80 || role.length > 80 || quote.length > 500) {
        sendJson(res, 400, { message: 'Please shorten your testimonial.' });
        return;
      }

      if (hasBlockedLanguage(`${name} ${role} ${quote}`.toLowerCase())) {
        sendJson(res, 400, { message: 'Please remove inappropriate language before submitting.' });
        return;
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

      sendJson(res, 201, { testimonial });
      return;
    }

    sendJson(res, 405, { message: 'Method not allowed.' });
  } catch (error) {
    sendJson(res, 500, {
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

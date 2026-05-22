import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  readJsonBody,
  requireAdmin,
  sendJson,
  supabaseRequest,
  type TestimonialRecord,
} from './_supabase';

type AdminBody = {
  id?: string;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (!requireAdmin(req)) {
      sendJson(res, 401, { message: 'Unauthorized.' });
      return;
    }

    if (req.method === 'GET') {
      const testimonials = await supabaseRequest<TestimonialRecord[]>(
        '?select=id,name,role,quote,status,created_at&status=eq.pending&order=created_at.desc',
      );

      sendJson(res, 200, { testimonials });
      return;
    }

    if (req.method === 'PATCH') {
      const body = await readJsonBody<AdminBody>(req);

      if (!body.id) {
        sendJson(res, 400, { message: 'Testimonial id is required.' });
        return;
      }

      const [testimonial] = await supabaseRequest<TestimonialRecord[]>(
        `?id=eq.${encodeURIComponent(body.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: 'approved' }),
        },
      );

      sendJson(res, 200, { testimonial });
      return;
    }

    if (req.method === 'DELETE') {
      const body = await readJsonBody<AdminBody>(req);

      if (!body.id) {
        sendJson(res, 400, { message: 'Testimonial id is required.' });
        return;
      }

      await supabaseRequest<void>(`?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'DELETE',
      });

      sendJson(res, 200, { message: 'Deleted.' });
      return;
    }

    sendJson(res, 405, { message: 'Method not allowed.' });
  } catch (error) {
    sendJson(res, 500, {
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

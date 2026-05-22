import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, KeyRound, Plus, Trash2, X } from 'lucide-react';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

type TestimonialsResponse = {
  testimonials: Testimonial[];
};

const defaultTestimonials: Testimonial[] = [
  {
    id: 'aria',
    name: 'Aria N.',
    role: 'Creative Director',
    quote: 'CJADE.studio delivered a polished campaign design that felt both bold and beautifully refined. Their attention to detail elevated the project at every step.',
  },
  {
    id: 'leo',
    name: 'Leo M.',
    role: 'Brand Strategist',
    quote: 'The work was fast, professional, and exactly what we needed. The collaboration felt easy, and the final result exceeded expectations.',
  },
  {
    id: 'mia',
    name: 'Mia K.',
    role: 'Content Producer',
    quote: 'I love how the visuals landed with clarity and personality. The team understood the brief immediately and delivered a standout experience.',
  },
];

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

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'CJ';
}

function hasBlockedLanguage(value: string) {
  return blockedWords.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(value.toLowerCase()));
}

async function readApiJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data && typeof data === 'object' && 'message' in data
      ? String(data.message)
      : 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data as T;
}

export default function Testimonials() {
  const [approvedTestimonials, setApprovedTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [sectionMessage, setSectionMessage] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const storedAdminToken = window.sessionStorage.getItem('cjade-admin-token') ?? '';
    setAdminToken(storedAdminToken);

    const loadApprovedTestimonials = async () => {
      try {
        const data = await fetch('/api/testimonials').then((response) => readApiJson<TestimonialsResponse>(response));
        setApprovedTestimonials(data.testimonials);
      } catch {
        setApprovedTestimonials([]);
      } finally {
        setIsLoadingTestimonials(false);
      }
    };

    loadApprovedTestimonials();
  }, []);

  const testimonials = useMemo(
    () => [...approvedTestimonials, ...defaultTestimonials],
    [approvedTestimonials],
  );

  const closeForm = () => {
    setIsAddingComment(false);
    setFormMessage('');
    setName('');
    setRole('');
    setQuote('');
  };

  const loadPendingTestimonials = async (token = adminToken) => {
    if (!token.trim()) {
      setAdminMessage('Enter your admin token first.');
      return;
    }

    try {
      setAdminMessage('Loading pending testimonials...');
      window.sessionStorage.setItem('cjade-admin-token', token);
      const data = await fetch('/api/testimonials-admin', {
        headers: { 'x-admin-token': token },
      }).then((response) => readApiJson<TestimonialsResponse>(response));

      setPendingTestimonials(data.testimonials);
      setAdminMessage(data.testimonials.length ? '' : 'No pending testimonials right now.');
    } catch (error) {
      setPendingTestimonials([]);
      setAdminMessage(error instanceof Error ? error.message : 'Could not load pending testimonials.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage('');
    setSectionMessage('');

    if (hasBlockedLanguage(`${name} ${role} ${quote}`)) {
      setFormMessage('Please remove inappropriate language before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim(),
          quote: quote.trim(),
        }),
      }).then((response) => readApiJson(response));

      closeForm();
      setSectionMessage('Thanks. Your comment was submitted for approval.');
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Could not submit your comment yet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveTestimonial = async (testimonial: Testimonial) => {
    try {
      setAdminMessage('');
      await fetch('/api/testimonials-admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ id: testimonial.id }),
      }).then((response) => readApiJson(response));

      setPendingTestimonials((current) => current.filter((item) => item.id !== testimonial.id));
      setApprovedTestimonials((current) => [testimonial, ...current]);
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Could not approve testimonial.');
    }
  };

  const deleteTestimonial = async (testimonialId: string) => {
    try {
      setAdminMessage('');
      await fetch('/api/testimonials-admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ id: testimonialId }),
      }).then((response) => readApiJson(response));

      setPendingTestimonials((current) => current.filter((item) => item.id !== testimonialId));
      setApprovedTestimonials((current) => current.filter((item) => item.id !== testimonialId));
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Could not delete testimonial.');
    }
  };

  return (
    <section id="testimonials" className="py-32 px-6 md:px-12 lg:px-24 bg-white/10 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-sm font-mono text-[#666] tracking-widest uppercase">03 / Client Feedback</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-black">
              What people say about the work.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsAdminPanelOpen((current) => !current)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-black/15 bg-white/80 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-black/5 transition hover:bg-white"
            >
              <KeyRound className="h-4 w-4" />
              Admin review
            </button>
            <button
              type="button"
              onClick={() => setIsAddingComment(true)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-black/15 bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[#222]"
            >
              <Plus className="h-4 w-4" />
              Add a comment
            </button>
          </div>
        </motion.div>

        {sectionMessage && (
          <p className="mb-8 rounded-lg border border-black/10 bg-white/80 px-4 py-3 text-sm text-[#222]">
            {sectionMessage}
          </p>
        )}

        {isAdminPanelOpen && (
          <div className="mb-10 rounded-lg border border-black/10 bg-white/80 p-5 shadow-lg shadow-black/5">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#777]">Admin approval</p>
                <h3 className="mt-1 text-xl font-semibold text-black">
                  Review new testimonials before publishing.
                </h3>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <input
                  type="password"
                  value={adminToken}
                  onChange={(event) => setAdminToken(event.target.value)}
                  className="rounded-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition focus:border-black"
                  placeholder="Admin token"
                />
                <button
                  type="button"
                  onClick={() => loadPendingTestimonials()}
                  className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222]"
                >
                  Load pending
                </button>
              </div>
            </div>

            {adminMessage && (
              <p className="mb-4 rounded-lg bg-black/5 px-4 py-3 text-sm text-[#333]">{adminMessage}</p>
            )}

            {pendingTestimonials.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="rounded-lg border border-black/10 bg-white p-4">
                    <p className="text-sm leading-6 text-[#222]">"{testimonial.quote}"</p>
                    <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">{testimonial.name}</p>
                        <p className="mt-1 text-xs text-[#666]">{testimonial.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => approveTestimonial(testimonial)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#222]"
                          aria-label={`Approve testimonial from ${testimonial.name}`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black hover:text-white"
                          aria-label={`Delete pending testimonial from ${testimonial.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isLoadingTestimonials && (
          <p className="mb-8 text-sm font-mono uppercase tracking-[0.24em] text-[#666]">Loading feedback...</p>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="rounded-lg border border-black/10 bg-white/90 p-8 shadow-lg shadow-black/5"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                {getInitials(testimonial.name)}
              </div>
              <p className="text-lg leading-relaxed text-[#111]">"{testimonial.quote}"</p>
              <div className="mt-6 border-t border-black/10 pt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black">{testimonial.name}</p>
                <p className="mt-1 text-sm text-[#555]">{testimonial.role}</p>
              </div>
              {isAdminPanelOpen && adminToken && testimonial.id.startsWith('user-') && (
                <button
                  type="button"
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {isAddingComment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={closeForm}
        >
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-xl rounded-lg border border-white/10 bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-mono uppercase tracking-[0.24em] text-[#777]">Client Feedback</p>
                <h3 className="mt-2 text-2xl font-bold text-black">Add a comment</h3>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black hover:text-white"
                aria-label="Close comment form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-black">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={80}
                  className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-black outline-none transition focus:border-black"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-black">Role</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  maxLength={80}
                  className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-black outline-none transition focus:border-black"
                  placeholder="Client, editor, designer..."
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-black">Comment</span>
                <textarea
                  value={quote}
                  onChange={(event) => setQuote(event.target.value)}
                  required
                  rows={5}
                  maxLength={500}
                  className="mt-2 w-full resize-none rounded-lg border border-black/10 px-4 py-3 text-black outline-none transition focus:border-black"
                  placeholder="Share your feedback..."
                />
              </label>
            </div>

            {formMessage && (
              <p className="mt-4 rounded-lg bg-black/5 px-4 py-3 text-sm text-[#333]">{formMessage}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !quote.trim()}
                className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for approval'}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </section>
  );
}

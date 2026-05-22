import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, X } from 'lucide-react';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
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

const storageKey = 'cjade-testimonials';
const pendingStorageKey = 'cjade-pending-testimonials';
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
  const normalizedValue = value.toLowerCase();
  return blockedWords.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(normalizedValue));
}

export default function Testimonials() {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const storedTestimonials = window.localStorage.getItem(storageKey);
    const storedPendingTestimonials = window.localStorage.getItem(pendingStorageKey);

    if (storedTestimonials) {
      try {
        setUserTestimonials(JSON.parse(storedTestimonials) as Testimonial[]);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    if (storedPendingTestimonials) {
      try {
        setPendingTestimonials(JSON.parse(storedPendingTestimonials) as Testimonial[]);
      } catch {
        window.localStorage.removeItem(pendingStorageKey);
      }
    }
  }, []);

  const testimonials = useMemo(
    () => [...userTestimonials, ...defaultTestimonials],
    [userTestimonials],
  );

  const closeForm = () => {
    setIsAddingComment(false);
    setFormMessage('');
    setName('');
    setRole('');
    setQuote('');
  };

  const saveApprovedTestimonials = (nextTestimonials: Testimonial[]) => {
    setUserTestimonials(nextTestimonials);
    window.localStorage.setItem(storageKey, JSON.stringify(nextTestimonials));
  };

  const savePendingTestimonials = (nextTestimonials: Testimonial[]) => {
    setPendingTestimonials(nextTestimonials);
    window.localStorage.setItem(pendingStorageKey, JSON.stringify(nextTestimonials));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasBlockedLanguage(`${name} ${role} ${quote}`)) {
      setFormMessage('Please remove inappropriate language before submitting.');
      return;
    }

    const nextTestimonial: Testimonial = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Visitor',
      quote: quote.trim(),
    };

    savePendingTestimonials([nextTestimonial, ...pendingTestimonials]);
    setFormMessage('');
    closeForm();
  };

  const approveTestimonial = (testimonial: Testimonial) => {
    saveApprovedTestimonials([testimonial, ...userTestimonials]);
    savePendingTestimonials(pendingTestimonials.filter((item) => item.id !== testimonial.id));
  };

  const deletePendingTestimonial = (testimonialId: string) => {
    savePendingTestimonials(pendingTestimonials.filter((item) => item.id !== testimonialId));
  };

  const deleteApprovedTestimonial = (testimonialId: string) => {
    saveApprovedTestimonials(userTestimonials.filter((item) => item.id !== testimonialId));
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

          <button
            type="button"
            onClick={() => setIsAddingComment(true)}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-black/15 bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[#222]"
          >
            <Plus className="h-4 w-4" />
            Add a comment
          </button>
        </motion.div>

        {pendingTestimonials.length > 0 && (
          <div className="mb-10 rounded-lg border border-black/10 bg-white/80 p-5 shadow-lg shadow-black/5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#777]">Pending approval</p>
                <h3 className="mt-1 text-xl font-semibold text-black">
                  Review new testimonials before publishing.
                </h3>
              </div>
              <span className="w-fit rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                {pendingTestimonials.length} waiting
              </span>
            </div>

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
                        onClick={() => deletePendingTestimonial(testimonial.id)}
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
          </div>
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
              {testimonial.id.startsWith('user-') && (
                <button
                  type="button"
                  onClick={() => deleteApprovedTestimonial(testimonial.id)}
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
                  className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-black outline-none transition focus:border-black"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-black">Role</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
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
                disabled={!name.trim() || !quote.trim()}
                className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit for approval
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </section>
  );
}

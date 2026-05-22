# Backend Setup

This project uses Vercel serverless API routes with Supabase as the database for testimonials.

## Supabase Table

Create a Supabase project, open the SQL editor, and run:

```sql
create table public.testimonials (
  id text primary key,
  name text not null,
  role text not null default 'Visitor',
  quote text not null,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);
```

## Vercel Environment Variables

Add these in Vercel under Project Settings > Environment Variables:

```txt
SUPABASE_URL=your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=your Supabase service role key
ADMIN_TOKEN=choose a private password/token for approving testimonials
```

Use the `ADMIN_TOKEN` in the site's Admin review panel to load, approve, or delete pending testimonials.

Do not commit the service role key to GitHub.

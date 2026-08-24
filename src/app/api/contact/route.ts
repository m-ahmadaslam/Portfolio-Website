import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Optional server-side sink for contact submissions.
 *
 * By design this route is INERT out of the box: with no database configured it
 * validates the payload and returns `{ ok: true }` without persisting anything,
 * so the site runs with zero backend setup. The contact form already delivers
 * mail client-side via EmailJS and POSTs here only as a fire-and-forget extra,
 * so this endpoint never blocks or breaks the user-facing flow.
 *
 * To start storing submissions:
 *   1. Add ONE connection string to .env.local (see .env.example):
 *        MONGODB_URI= | DATABASE_URL= (Neon/Postgres) | SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY=
 *   2. Install that vendor's driver, e.g.:
 *        npm i mongodb          # MongoDB
 *        npm i @neondatabase/serverless   # Neon
 *        npm i @supabase/supabase-js      # Supabase
 *   3. Uncomment the matching adapter in `persist()` below.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // honeypot: real users never fill this; bots often do
  company: z.string().optional(),
});

type Contact = Omit<z.infer<typeof ContactSchema>, "company">;

async function persist(entry: Contact): Promise<void> {
  const record = { ...entry, createdAt: new Date().toISOString() };

  // ── MongoDB ────────────────────────────────────────────────────────────
  // if (process.env.MONGODB_URI) {
  //   const { MongoClient } = await import("mongodb");
  //   const client = new MongoClient(process.env.MONGODB_URI);
  //   try {
  //     await client.connect();
  //     await client.db("portfolio").collection("messages").insertOne(record);
  //   } finally {
  //     await client.close();
  //   }
  //   return;
  // }

  // ── Neon / Postgres ────────────────────────────────────────────────────
  // Table: create table messages (
  //   id bigint generated always as identity primary key,
  //   name text not null, email text not null, message text not null,
  //   created_at timestamptz not null default now()
  // );
  // if (process.env.DATABASE_URL) {
  //   const { neon } = await import("@neondatabase/serverless");
  //   const sql = neon(process.env.DATABASE_URL);
  //   await sql`insert into messages (name, email, message, created_at)
  //             values (${record.name}, ${record.email}, ${record.message}, ${record.createdAt})`;
  //   return;
  // }

  // ── Supabase ───────────────────────────────────────────────────────────
  // if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  //   const { createClient } = await import("@supabase/supabase-js");
  //   const supabase = createClient(
  //     process.env.SUPABASE_URL,
  //     process.env.SUPABASE_SERVICE_ROLE_KEY
  //   );
  //   await supabase.from("messages").insert(record);
  //   return;
  // }

  // No store configured — accept and drop. Swap for logging if you prefer.
  void record;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  // honeypot tripped: pretend success, store nothing
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = parsed.data;

  try {
    await persist({ name, email, message });
  } catch (err) {
    // Never surface storage failures to the client: EmailJS is the real
    // delivery path, so we log and still report success.
    console.error("[/api/contact] persist failed:", err);
  }

  return NextResponse.json({ ok: true });
}

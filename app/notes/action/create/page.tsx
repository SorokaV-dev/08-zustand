import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const title = "Create note | NoteHub";
const description = "Create a new note in your NoteHub collection.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/notes/action/create" },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/notes/action/create`,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    type: "website",
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}

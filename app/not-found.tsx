import type { Metadata } from "next";
import css from "./Home.module.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Page not found | NoteHub",
  description: "The page you are looking for does not exist in NoteHub.",
  alternates: { canonical: "/404" },
  openGraph: {
    title: "Page not found | NoteHub",
    description: "The page you are looking for does not exist in NoteHub.",
    url: `${siteUrl}/404`,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    type: "website",
  },
};

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}

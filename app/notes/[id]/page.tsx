import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";
import { fetchNoteById } from "@/lib/api";
import { noteKeys } from "@/lib/query/keys";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const openGraphImage =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

async function getNote(id: string) {
  if (!process.env.NEXT_PUBLIC_NOTEHUB_TOKEN) return null;

  try {
    return await fetchNoteById(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNote(id);
  const title = note?.title ?? "Note details | NoteHub";
  const description = note?.content.slice(0, 160) || "View a NoteHub note.";
  const url = `${siteUrl}/notes/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [openGraphImage],
      type: "article",
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  if (process.env.NEXT_PUBLIC_NOTEHUB_TOKEN) {
    await queryClient.prefetchQuery({
      queryKey: noteKeys.detail(id),
      queryFn: () => fetchNoteById(id),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

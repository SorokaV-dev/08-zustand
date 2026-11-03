import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotePreview from "@/components/NotePreview/NotePreview";
import { fetchNoteById } from "@/lib/api/notes";
import { noteKeys } from "@/lib/query/keys";

export const dynamic = "force-dynamic";

interface InterceptedNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function InterceptedNotePage({
  params,
}: InterceptedNotePageProps) {
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
      <NotePreview />
    </HydrationBoundary>
  );
}

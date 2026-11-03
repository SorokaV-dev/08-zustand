import SidebarNotes from "@/components/SidebarNotes/SidebarNotes";
import { parseNoteFilter } from "@/lib/notes/filter";

interface SidebarPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function SidebarPage({ params }: SidebarPageProps) {
  const { slug } = await params;
  const activeFilter = parseNoteFilter(slug) ?? "all";

  return <SidebarNotes activeFilter={activeFilter} />;
}

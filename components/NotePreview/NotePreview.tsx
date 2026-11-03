"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

export default function NotePreview() {
  const router = useRouter();
  const closePreview = () => router.back();

  return (
    <Modal onClose={closePreview}>
      <NoteDetailsClient isPreview onClose={closePreview} />
    </Modal>
  );
}

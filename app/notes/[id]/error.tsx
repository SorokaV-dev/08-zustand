"use client";

export default function NoteError({ error }: { error: Error }) {
  return (
    <main role="alert">
      <p>Could not fetch note details. {error.message}</p>
    </main>
  );
}

"use client";

export default function NotesError({ error }: { error: Error }) {
  return (
    <main role="alert">
      <p>Could not fetch the list of notes. {error.message}</p>
    </main>
  );
}

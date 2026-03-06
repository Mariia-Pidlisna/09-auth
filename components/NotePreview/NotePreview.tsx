"use client";

import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";
import { useRouter } from "next/navigation";

interface NotePreviewProps {
  note?: Note;
}

export default function NotePreview({ note }: NotePreviewProps) {
  const router = useRouter();
  function handleClose() {
    router.back();
  }

  return (
    <div className={css.container}>
      {note && (
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <button className={css.backBtn} onClick={handleClose}>
              Back
            </button>
          </div>
          <p className={css.content}>{note.content}</p>
          {note.tag && <p className={css.tag}>Tag: {note.tag}</p>}
          {note.createdAt && (
            <p className={css.date}>
              Created date: {new Date(note.createdAt).toLocaleDateString()}
            </p>
          )}
          {note.updatedAt && (
            <p className={css.date}>
              Updated date: {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
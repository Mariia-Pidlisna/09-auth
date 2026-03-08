"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

export default function NoteDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (note?.title) {
      const oldTitle = document.title; 
      document.title = `${note.title} | NoteHub`;
      
      return () => {
        document.title = oldTitle;
      };
    }
  }, [note]);

  if (isLoading) return <p className={css.message}>Loading, please wait...</p>;
  if (isError || !note) return <p className={css.message}>Something went wrong.</p>;

  
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <button className={css.backBtn}>Back</button>
          <h2>{note.title}</h2>
          <button className={css.editBtn}>Edit note</button>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

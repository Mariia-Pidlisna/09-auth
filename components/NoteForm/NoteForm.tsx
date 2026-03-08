"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api/clientApi";
import type { NoteTag } from "../../types/note";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

interface NoteFormProps {
  onClose?: () => void;
}

const tagOptions: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export type NewNoteData = {
  title: string;
  content: string;
  tag: NoteTag;
};

function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created successfully");
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (onClose) onClose();
      router.push("/notes/filter/All");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const validate = () => {
    const newErrors: typeof errors = {};
    if (draft.title.trim().length < 3) {
      newErrors.title = "Minimum 3 characters";
    }
    if (draft.title.length > 50) {
      newErrors.title = "Maximum 50 characters";
    }
    if (draft.content.length > 500) {
      newErrors.content = "Maximum 500 characters";
    }
    if (!tagOptions.includes(draft.tag as NoteTag)) {
      newErrors.tag = "Tag is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => router.push("/notes/filter/All");

  const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  
  if (!validate()) return;
  
  mutate(draft);
};

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      {/* Title field */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={draft.title}
          className={css.input}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      {/* Content field */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={draft.content}
          className={css.textarea}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      {/* Tag field */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
         value={draft.tag}
          onChange={handleChange}
        >
          {tagOptions.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      {/* Form actions */}
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import NotePreview from "@/components/NotePreview/NotePreview";

type Props = {
  id: string;
};

export default function NoteDetailsClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  function handleClose() {
    router.back();
  }

  if (isLoading) {
    return <Modal>Loading...</Modal>;
  }

  if (error || !data) {
    return <Modal>Error loading note.</Modal>;
  }

  return (
    <Modal onClose={handleClose}>
      <NotePreview note={data} />
    </Modal>
  );
}
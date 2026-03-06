import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { NoteTag } from "@/types/note";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tagCandidate = slug?.[0];

  const isAll = !tagCandidate || tagCandidate === "all";
  const displayTag = isAll ? "All" : tagCandidate;

  return {
    title: `${displayTag} Notes | NoteHub`,
    description: `Manage your ${displayTag.toLowerCase()} notes and stay organized.`,
    openGraph: {
      title: `${displayTag} Notes — NoteHub`,
      description: `Browse ${displayTag.toLowerCase()} notes. Stay organized and access them when needed.`,
      url: `https://08-zustand-iota-flame.vercel.app/notes/filter/${tagCandidate || "all"}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tagCandidate = slug?.[0];

  const tag = (tagCandidate && tagCandidate !== "all") 
    ? (tagCandidate as NoteTag) 
    : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}

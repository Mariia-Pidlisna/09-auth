
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const note = await fetchNoteById(id);
    return {
        title: `${note.title}`,
        description: `${note.content}`,
        openGraph: {
            title: `${note.title}`,
            description: `${note.content}`,
            url: `https://08-zustand-iota-flame.vercel.app/notes/${note.id}`,
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: `${note.title}`,
                },
            ],
        }
    }
}
  
const NoteDetails = async ({ params }: Props) => {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    );
};

export default NoteDetails;

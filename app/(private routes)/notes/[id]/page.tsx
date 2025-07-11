import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchServerNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

interface NoteDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = params;
  const note = await fetchServerNoteById(id);
  const description =
    note.content.length > 100
      ? note.content.slice(0, 100) + "..."
      : note.content;

  return {
    title: `Note: ${note.title}`,
    description,
    openGraph: {
      title: `Note: ${note.title}`,
      description,
      url: `https://your-domain.com/notes/${note.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchServerNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NoteDetailsClient id={id} dehydratedState={dehydratedState} />;
}

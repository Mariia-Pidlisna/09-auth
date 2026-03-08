import { cookies } from "next/headers";
import { nextServer } from "./api";
import { FetchNotesResponse } from "./clientApi";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { NoteTag } from "@/types/note";

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getMeServer = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export async function fetchNotesServer(
  query: string,
  page: number,
  tag?: Exclude<NoteTag, "All">
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page: page,
    perPage: 12,
  };

  if (tag && tag !== undefined) {
    params.tag = tag;
  }

  if (query && query.trim() !== "") {
    params.search = query;
  }

  const cookieStore = await cookies();
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}
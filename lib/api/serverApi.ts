import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { FetchNotesParams, Note, NotesResponse } from "@/types/note";
import axios from "axios";

const serverBaseURL = 'https://notehub-api.goit.study';

export const serverApi = axios.create({
  baseURL: serverBaseURL,
  withCredentials: true,
});


export const checkServerSession = async () => {
  const cookieStore = cookies();
  const res = await nextServer.get('auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  }); 
  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('users/me', {
      headers: {
          Cookie: cookieStore.toString(),
  },
  })
  return data;
}
export async function fetchServerNotes(params?: FetchNotesParams): Promise<NotesResponse> {
  try {
    const cookieStore = await cookies(); 

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    const response = await nextServer.get('/notes', {
      params,
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response.data;
  } catch (error) {
    console.error("fetchServerNotes error:", error);
    throw new Error("Access denied or fetch failed");
  }
}
export async function fetchServerNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await nextServer.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

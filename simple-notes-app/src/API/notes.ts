import { pool } from "./db";

// You can hardcode or pass a userId since we're skipping auth
export async function createNote(userId: number,title: string, content: string): Promise<void> {
  await pool.query(
    "INSERT INTO posts (id,title,content,views,created_at,updated_at) VALUES ($1, $2,$3,$4,$5,$6)",
    [userId, title, content, 1, new Date(), new Date()]
  );
}

export async function editNote(noteId: number, content: string): Promise<void> {
  await pool.query(
    "UPDATE notes SET content = $1, updated_at = NOW() WHERE id = $2",
    [content, noteId]
  );
}

export async function deleteNote(noteId: number): Promise<void> {
  await pool.query(
    "DELETE FROM notes WHERE id = $1",
    [noteId]
  );
}
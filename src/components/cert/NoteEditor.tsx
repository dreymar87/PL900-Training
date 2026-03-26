"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface NoteEditorProps {
  certSlug: string;
  moduleSlug?: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

function storageKey(certSlug: string, moduleSlug?: string): string {
  return moduleSlug ? `notes-${certSlug}-${moduleSlug}` : `notes-${certSlug}`;
}

function loadNotes(certSlug: string, moduleSlug?: string): Note[] {
  try {
    const raw = localStorage.getItem(storageKey(certSlug, moduleSlug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(certSlug: string, notes: Note[], moduleSlug?: string) {
  try {
    localStorage.setItem(storageKey(certSlug, moduleSlug), JSON.stringify(notes));
  } catch {}
}

export default function NoteEditor({ certSlug, moduleSlug }: NoteEditorProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNotes(loadNotes(certSlug, moduleSlug));
    setLoaded(true);
  }, [certSlug, moduleSlug]);

  const addNote = useCallback(() => {
    if (!newNote.trim()) return;
    const now = Date.now();
    const note: Note = {
      id: `note-${now}`,
      content: newNote.trim(),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(certSlug, updated, moduleSlug);
    setNewNote("");
  }, [newNote, notes, certSlug, moduleSlug]);

  const deleteNote = useCallback(
    (id: string) => {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      saveNotes(certSlug, updated, moduleSlug);
    },
    [notes, certSlug, moduleSlug]
  );

  const startEdit = useCallback((note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingId || !editContent.trim()) return;
    const updated = notes.map((n) =>
      n.id === editingId
        ? { ...n, content: editContent.trim(), updatedAt: Date.now() }
        : n
    );
    setNotes(updated);
    saveNotes(certSlug, updated, moduleSlug);
    setEditingId(null);
    setEditContent("");
  }, [editingId, editContent, notes, certSlug, moduleSlug]);

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      action();
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!loaded) {
    return <div className="text-text-secondary text-center py-8">Loading...</div>;
  }

  return (
    <div>
      {/* New note input */}
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, addNote)}
          placeholder="Write a note... (Ctrl+Enter to save)"
          className="w-full bg-surface-primary border border-border-primary rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={addNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </h3>
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-surface-primary border border-border-primary rounded-xl p-4"
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, saveEdit)}
                    className="w-full bg-surface-secondary border border-border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-accent/40 transition-colors"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border-primary hover:bg-surface-tertiary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-primary">
                    <span className="text-xs text-text-muted">
                      {formatDate(note.updatedAt)}
                      {note.updatedAt !== note.createdAt && " (edited)"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-xs text-text-muted hover:text-accent transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-xs text-text-muted hover:text-danger transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {notes.length === 0 && (
        <p className="text-sm text-text-muted text-center py-6">
          No notes yet. Start writing above to capture your thoughts.
        </p>
      )}
    </div>
  );
}

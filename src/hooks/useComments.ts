import { useEffect, useState } from "react";
import { RxDatabase } from "rxdb";
import { Subscription } from "rxjs";

import { getDatabase } from "../database/db";
import { CommentCollections, CommentDocType } from "../types";

/**
 * Custom hook to encapsulate comment CRUD logic.
 * It provides a real-time subscription to comments, a method to add comments,
 * and a recursive deletion function to remove a comment along with its child comments.
 */
export const useComments = () => {
  const [comments, setComments] = useState<CommentDocType[]>([]);
  const [db, setDb] = useState<RxDatabase<CommentCollections>>();

  useEffect(() => {
    let subscription: Subscription;
    (async () => {
      const database = await getDatabase();
      setDb(database);
      // Subscribe to changes in the comments collection (real-time updates)
      subscription = database.comments
        .find()
        .sort({ createdAt: "asc" })
        .$.subscribe((docs) => {
          if (docs) {
            setComments(docs.map((doc: any) => doc.toJSON()));
          }
        });
    })();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  /**
   * Adds a new comment. If parentId is provided, the comment is treated as a reply.
   */
  const addComment = async (text: string, parentId: string | null = null) => {
    if (!db || !text.trim()) return;

    const nowTimestamp = Date.now();
    await db.comments.insert({
      id: nowTimestamp.toString(),
      text,
      parentId,
      createdAt: nowTimestamp,
    });
  };

  /**
   * Recursively collects all comments (including nested children)
   * starting from a given commentId, and then performs a bulk deletion.
   *
   * @param commentId - The ID of the comment to delete.
   */
  async function deleteComment(commentId: string): Promise<void> {
    if (!db) return;

    // Array to store documents to be deleted
    const docsIdsToDelete: string[] = [];

    // Helper function to recursively collect all child comment docs.
    async function collectDocs(id: string) {
      if (!db) return;

      const children = await db.comments
        .find({ selector: { parentId: id } })
        .exec();

      for (const child of children) {
        docsIdsToDelete.push(child.id);
        await collectDocs(child.id);
      }
    }

    // Collect child documents of the target comment.
    await collectDocs(commentId);

    // Retrieve the parent comment document.
    const parentDoc = await db.comments
      .findOne({ selector: { id: commentId } })
      .exec();

    if (parentDoc) {
      docsIdsToDelete.push(parentDoc.id);
    }

    // Use bulkRemove to delete all collected documents in one operation.
    const { error } = await db.comments.bulkRemove(docsIdsToDelete);

    if (error?.length) throw error;
  }

  return { comments, addComment, deleteComment };
};

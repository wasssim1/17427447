import React, { useState } from "react";

import { CommentDocType } from "../types";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: CommentDocType;
  addComment: (text: string, parentId?: string | null) => void;
  deleteComment: (id: string) => void;
}

/**
 * CommentItem shows a single comment along with a reply form that can be toggled.
 */
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  addComment,
  deleteComment,
}) => {
  const [replying, setReplying] = useState(false);

  // Handle submission of a reply
  const handleReply = (text: string) => {
    addComment(text, comment.id);
    setReplying(false);
  };

  return (
    <>
      <p>{comment.text}</p>
      <small>{new Date(comment.createdAt).toLocaleString()}</small>
      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={() => setReplying(!replying)}>Reply</button>
        <button
          onClick={() => deleteComment(comment.id)}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>

      {/* If user clicked Reply, show a small form */}
      {replying && (
        <div style={{ marginTop: "0.5rem" }}>
          <CommentForm onSubmit={handleReply} placeholder="Write a reply..." />
        </div>
      )}
    </>
  );
};

export default CommentItem;

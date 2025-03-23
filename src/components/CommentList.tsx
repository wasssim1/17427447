import React from "react";

import { CommentDocType } from "../types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentDocType[];
  parentId?: string | null;
  addComment: (text: string, parentId?: string | null) => void;
  deleteComment: (id: string) => void;
}

/**
 * CommentList renders a list of comments that share the same parent.
 * It calls itself recursively to render nested replies.
 */
const CommentList: React.FC<CommentListProps> = ({
  comments,
  parentId = null,
  addComment,
  deleteComment,
}) => {
  // Filter comments whose parentId matches the current parentId
  const filteredComments = comments.filter(
    (comment) => comment.parentId === parentId
  );

  return (
    <div className="comment-list">
      {filteredComments.map((comment) => (
        <div
          className="comment-item"
          style={{ marginLeft: "1rem" }}
          key={comment.id}
        >
          <CommentItem
            comment={comment}
            addComment={addComment}
            deleteComment={deleteComment}
          />
          {/* Recursively render children */}
          <CommentList
            comments={comments}
            parentId={comment.id}
            addComment={addComment}
            deleteComment={deleteComment}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentList;

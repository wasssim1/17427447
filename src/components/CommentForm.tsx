import React, { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

/**
 * CommentForm renders an input and a button for submitting a comment.
 * It is used for both top-level comments and replies.
 */
const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = "Add a comment...",
}) => {
  const [text, setText] = useState("");

  // Handle form submission and clear input afterwards
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "10px" }} role="form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        style={{ width: "80%", padding: "8px" }}
      />
      <button type="submit" style={{ padding: "8px 12px", marginLeft: "5px" }}>
        Post
      </button>
    </form>
  );
};

export default CommentForm;

import React from "react";

import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import { useComments } from "../hooks/useComments";

/**
 * Main Home page displays the comment system app.
 */
const Home: React.FC = () => {
  const { comments, addComment, deleteComment } = useComments();

  return (
    <div
      className="home-container"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <h2>Autarc Live Comment</h2>
      <CommentList
        comments={comments}
        parentId={null}
        addComment={addComment}
        deleteComment={deleteComment}
      />
      <br />
      <CommentForm onSubmit={(text) => addComment(text)} />
    </div>
  );
};

export default Home;

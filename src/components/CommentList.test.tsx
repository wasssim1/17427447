import { fireEvent, render, screen } from "@testing-library/react";

import { CommentDocType } from "../types";
import CommentList from "./CommentList";

// Mock CommentItem to test prop passing and interactions
jest.mock("./CommentItem", () => ({
  __esModule: true,
  default: ({ comment, deleteComment, addComment }: any) => (
    <div data-testid={`comment-${comment.id}`}>
      <span>{comment.text}</span>
      <button
        onClick={() => deleteComment(comment.id)}
        data-testid={`delete-${comment.id}`}
      >
        Delete
      </button>
      <button
        onClick={() => addComment("New reply", comment.id)}
        data-testid={`reply-${comment.id}`}
      >
        Reply
      </button>
    </div>
  ),
}));

const mockComments: CommentDocType[] = [
  { id: "1", text: "Parent comment", parentId: null, createdAt: 123 },
  { id: "2", text: "Child comment", parentId: "1", createdAt: 234 },
  { id: "3", text: "Sibling comment", parentId: null, createdAt: 345 },
];

describe("CommentList", () => {
  const mockAddComment = jest.fn();
  const mockDeleteComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders top-level comments", () => {
    render(
      <CommentList
        comments={mockComments}
        parentId={null}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    // Check parent comments
    expect(screen.getByText("Parent comment")).toBeInTheDocument();
    expect(screen.getByText("Sibling comment")).toBeInTheDocument();
  });

  test("applies recursive margin styling", () => {
    const { container } = render(
      <CommentList
        comments={mockComments}
        parentId={null}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    // Check all comment containers have base margin
    const commentContainers = container.querySelectorAll(".comment-item");
    commentContainers.forEach((container) => {
      expect(container).toHaveStyle("margin-left: 1rem");
    });
  });

  test("handles comment deletion", () => {
    render(
      <CommentList
        comments={mockComments}
        parentId={null}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    fireEvent.click(screen.getByTestId("delete-1"));
    expect(mockDeleteComment).toHaveBeenCalledWith("1");
  });

  test("handles comment replies", () => {
    render(
      <CommentList
        comments={mockComments}
        parentId={null}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    fireEvent.click(screen.getByTestId("reply-1"));
    expect(mockAddComment).toHaveBeenCalledWith("New reply", "1");
  });

  test("filters comments by parentId", () => {
    render(
      <CommentList
        comments={mockComments}
        parentId="1"
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    expect(screen.getByText("Child comment")).toBeInTheDocument();
    expect(screen.queryByText("Parent comment")).not.toBeInTheDocument();
    expect(screen.queryByText("Sibling comment")).not.toBeInTheDocument();
  });

  test("renders empty state when no comments match", () => {
    const { container } = render(
      <CommentList
        comments={mockComments}
        parentId="invalid-id"
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    expect(container.querySelector(".comment-list")).toBeEmptyDOMElement();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";

import { CommentDocType } from "../types";
import CommentItem from "./CommentItem";

// Mock the CommentForm component to simplify testing
jest.mock("./CommentForm", () => ({
  __esModule: true,
  default: ({ onSubmit }: { onSubmit: (text: string) => void }) => (
    <div data-testid="comment-form">
      <button onClick={() => onSubmit("Test reply")}>Submit</button>
    </div>
  ),
}));

const mockComment: CommentDocType = {
  id: "123",
  text: "Test comment",
  parentId: null,
  createdAt: Date.now(),
};

const mockAddComment = jest.fn();
const mockDeleteComment = jest.fn();

describe("CommentItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders comment content and buttons", () => {
    render(
      <CommentItem
        comment={mockComment}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    // Verify comment content
    expect(screen.getByText(mockComment.text)).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockComment.createdAt).toLocaleString())
    ).toBeInTheDocument();

    // Verify buttons
    expect(screen.getByRole("button", { name: "Reply" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  test("toggles reply form when Reply button is clicked", () => {
    render(
      <CommentItem
        comment={mockComment}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    // Form should not be visible initially
    expect(screen.queryByTestId("comment-form")).not.toBeInTheDocument();

    // Click Reply button
    fireEvent.click(screen.getByText("Reply"));
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();

    // Click Reply button again to close
    fireEvent.click(screen.getByText("Reply"));
    expect(screen.queryByTestId("comment-form")).not.toBeInTheDocument();
  });

  test("calls deleteComment with correct ID when Delete is clicked", () => {
    render(
      <CommentItem
        comment={mockComment}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockDeleteComment).toHaveBeenCalledWith(mockComment.id);
  });

  test("submits reply form and calls addComment correctly", () => {
    render(
      <CommentItem
        comment={mockComment}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    // Open reply form
    fireEvent.click(screen.getByText("Reply"));

    // Submit form
    fireEvent.click(screen.getByText("Submit"));

    // Verify addComment was called with correct arguments
    expect(mockAddComment).toHaveBeenCalledWith("Test reply", mockComment.id);

    // Verify form is closed after submission
    expect(screen.queryByTestId("comment-form")).not.toBeInTheDocument();
  });

  test("applies correct styling", () => {
    const { container } = render(
      <CommentItem
        comment={mockComment}
        addComment={mockAddComment}
        deleteComment={mockDeleteComment}
      />
    );

    // Verify button spacing
    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toHaveStyle("margin-left: 0.5rem");

    // Verify form spacing
    fireEvent.click(screen.getByText("Reply"));
    const formContainer = container.querySelector("div > div");
    expect(formContainer).toHaveStyle("margin-top: 0.5rem");
  });
});

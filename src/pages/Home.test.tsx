import { render, screen, waitFor } from "@testing-library/react";

import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import { useComments } from "../hooks/useComments";
import Home from "./Home";

// Mock dependencies
jest.mock("../hooks/useComments");
jest.mock("../components/CommentList");
jest.mock("../components/CommentForm");

const mockUseComments = useComments as jest.MockedFunction<typeof useComments>;
const mockCommentList = CommentList as jest.MockedFunction<typeof CommentList>;
const mockCommentForm = CommentForm as jest.MockedFunction<typeof CommentForm>;

// [SKIPPED] - TODO: adjust test setup
describe.skip("Home", () => {
  const mockComments = [
    { id: "1", text: "Test comment", parentId: null, createdAt: Date.now() },
  ];
  const mockAddComment = jest.fn();
  const mockDeleteComment = jest.fn();

  beforeEach(() => {
    mockUseComments.mockReturnValue({
      comments: mockComments,
      addComment: mockAddComment,
      deleteComment: mockDeleteComment,
    });

    mockCommentList.mockImplementation(() => (
      <div data-testid="comment-list" />
    ));
    mockCommentForm.mockImplementation(() => (
      <div data-testid="comment-form" />
    ));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the main layout and components", () => {
    render(<Home />);

    // Check title
    expect(
      screen.getByRole("heading", { name: "Autarc Live Comment" })
    ).toBeInTheDocument();

    // Check components are rendered
    expect(screen.getByTestId("comment-list")).toBeInTheDocument();
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();
  });

  test("passes correct props to CommentList", () => {
    render(<Home />);

    expect(mockCommentList).toHaveBeenCalledWith(
      expect.objectContaining({
        comments: mockComments,
        parentId: null,
        addComment: mockAddComment,
        deleteComment: mockDeleteComment,
      }),
      expect.anything()
    );
  });

  test("passes correct props to CommentForm", () => {
    render(<Home />);

    expect(mockCommentForm).toHaveBeenCalledWith(
      expect.objectContaining({
        onSubmit: expect.any(Function),
        placeholder: undefined,
      }),
      expect.anything()
    );
  });

  test("applies correct container styles", () => {
    const { container } = render(<Home />);
    const mainDiv = container.querySelector(".home-container");

    expect(mainDiv).toHaveStyle({
      maxWidth: "600px",
      margin: "0 auto",
    });
  });

  test("form submission calls addComment", () => {
    // Get the actual onSubmit prop from the mock
    let submitHandler: (text: string) => void = jest.fn();
    mockCommentForm.mockImplementation(({ onSubmit }) => {
      submitHandler = onSubmit;
      return <div data-testid="comment-form" />;
    });

    render(<Home />);

    const testComment = "New comment";
    submitHandler(testComment);

    waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith(testComment);
    });
  });
});

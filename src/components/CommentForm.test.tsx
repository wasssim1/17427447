import { fireEvent, render, screen } from "@testing-library/react";
import CommentForm from "./CommentForm";

describe("CommentForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test("renders with default placeholder when none is provided", () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText("Add a comment...");
    expect(input).toBeInTheDocument();
  });

  test("renders with custom placeholder when provided", () => {
    render(
      <CommentForm onSubmit={mockOnSubmit} placeholder="Custom placeholder" />
    );
    const input = screen.getByPlaceholderText("Custom placeholder");
    expect(input).toBeInTheDocument();
  });

  test("updates input value when user types", () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test comment" } });
    expect(input).toHaveValue("test comment");
  });

  test("submits form and calls onSubmit with input text", () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const input = screen.getByRole("textbox");
    const form = screen.getByRole("form");

    fireEvent.change(input, { target: { value: "test comment" } });
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith("test comment");
  });

  test("clears input after submission", () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const input = screen.getByRole("textbox");
    const form = screen.getByRole("form");

    fireEvent.change(input, { target: { value: "test comment" } });
    fireEvent.submit(form);

    expect(input).toHaveValue("");
  });

  test("does not call onSubmit when input is empty", () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const form = screen.getByRole("form");

    fireEvent.submit(form);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("does not call onSubmit when input is whitespace", () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const input = screen.getByRole("textbox");
    const form = screen.getByRole("form");

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(form);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("calls onSubmit when submit button is clicked", () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Post" });

    fireEvent.change(input, { target: { value: "button click test" } });
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith("button click test");
  });

  test('has a submit button with text "Post"', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    const button = screen.getByRole("button", { name: "Post" });
    expect(button).toBeInTheDocument();
  });
});

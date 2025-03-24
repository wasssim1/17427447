import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Home from "./pages/Home";

// Mock the RxDB database to avoid real DB operations
jest.mock("./database/db", () => {
  let comments: any[] = [];
  return {
    getDatabase: async () => ({
      comments: {
        find: () => ({
          sort: () => ({
            $: {
              subscribe: (fn: (docs: any) => void) => {
                fn(comments);
                return { unsubscribe: () => {} };
              },
            },
          }),
        }),
        insert: async (doc: any) => {
          comments.push(doc);
        },
        findOne: () => ({
          exec: async () => ({
            remove: async () => {
              comments = comments.filter((c) => c.id !== "1");
            },
          }),
        }),
      },
    }),
  };
});

describe("Home Page Integration Test", () => {
  // [SKIPPED] - TODO: adjust test setup
  test.skip("allows adding a comment and then deleting it recursively", async () => {
    render(<Home />);

    // Add a top-level comment
    fireEvent.change(screen.getByPlaceholderText(/add a comment/i), {
      target: { value: "Integration Parent" },
    });
    fireEvent.click(screen.getByText(/post/i));

    // Wait for the comment to appear
    await waitFor(() => {
      const element = screen.getByText((content, element) =>
        content.replace(/\s+/g, " ").includes("Integration Parent")
      );
      console.log({ element });

      expect(element).toBeInTheDocument();
    });

    // Click the delete button
    fireEvent.click(screen.getByText(/delete/i));

    // Verify the comment is removed
    await waitFor(() => {
      expect(
        screen.queryByText((content, element) =>
          content.replace(/\s+/g, " ").includes("Integration Parent")
        )
      ).not.toBeInTheDocument();
    });
  });
});

import { act, renderHook } from "@testing-library/react";
import { RxDatabase } from "rxdb";
import { Subject, Subscription } from "rxjs";
import { getDatabase } from "../database/db";
import { CommentCollections } from "../types";
import { useComments } from "./useComments";

jest.mock("../database/db", () => ({
  getDatabase: jest.fn(),
}));

const mockComments$ = new Subject<any>();
const mockInsert = jest.fn();
const mockBulkRemove = jest.fn();
const mockFindOne = jest.fn();

const createMockDatabase = () => ({
  comments: {
    find: jest.fn().mockImplementation((selector?: any) => {
      // Handle initial subscription query
      if (!selector) {
        return {
          sort: jest.fn().mockReturnValue({ $: mockComments$ }),
        };
      }
      // Handle find with selectors (for delete)
      return {
        exec: jest.fn().mockResolvedValue([]),
      };
    }),
    insert: mockInsert,
    bulkRemove: mockBulkRemove,
    findOne: mockFindOne,
  },
});

describe("useComments", () => {
  let mockDatabase: RxDatabase<CommentCollections>;
  let mockSubscription: Subscription;

  beforeEach(() => {
    mockDatabase =
      createMockDatabase() as unknown as RxDatabase<CommentCollections>;
    (getDatabase as jest.Mock).mockResolvedValue(mockDatabase);
    mockSubscription = { unsubscribe: jest.fn() } as unknown as Subscription;
    mockComments$.subscribe = jest.fn().mockReturnValue(mockSubscription);
    jest.clearAllMocks();
  });

  test("should initialize database and subscribe to comments", async () => {
    const { result } = renderHook(() => useComments());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getDatabase).toHaveBeenCalledTimes(1);
    expect(result.current.comments).toEqual([]);
  });

  test("should add comment to database", async () => {
    const { result } = renderHook(() => useComments());

    // Wait for DB initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.addComment("New comment");
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "New comment",
        parentId: null,
      })
    );
  });

  test("should handle subscription cleanup", async () => {
    const { unmount } = renderHook(() => useComments());

    // Wait for DB initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    unmount();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});

import { RxCollection } from "rxdb";

// type for a comment document
export interface CommentDocType {
  id: string;
  text: string;
  parentId: string | null;
  createdAt: number;
}

// database collections interface
export interface CommentCollections {
  comments: RxCollection<CommentDocType>;
}

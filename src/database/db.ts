import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

import { CommentCollections } from "../types";

// Add dev mode plugin for debugging
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

let _dbPromise: Promise<RxDatabase<CommentCollections>>;

// Initialize and return the RxDB database instance
export const getDatabase = async () => {
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const db = await createRxDatabase<CommentCollections>({
        name: "commentsdb",
        storage: getRxStorageDexie(),
      });
      await db.addCollections({
        comments: {
          schema: {
            title: "comments schema",
            version: 0,
            primaryKey: "id",
            type: "object",
            properties: {
              id: { type: "string", maxLength: 30 },
              text: { type: "string" },
              parentId: { type: ["string", "null"] },
              createdAt: { type: "number" },
            },
            required: ["id", "text", "createdAt"],
          },
        },
      });
      return db;
    })();
  }
  return _dbPromise;
};

import { createClient } from "edgedb";
import { describe } from "vitest";
import { runStorageAdapterTests } from "@automerge/automerge-repo/helpers/tests/storage-adapter-tests.js";
import { EdgeDBStorageAdapter } from "../src/index.js";

describe("EdgeDBStorageAdapter", () => {
  const setup = async () => {
    const client = createClient();
    await client.ensureConnected();
    const teardown = async () => {
      await client.execute(`delete automerge_repo::Blob;`);
      await client.close();
    };
    const adapter = new EdgeDBStorageAdapter(client);
    return { adapter, teardown };
  };

  runStorageAdapterTests(setup);
});

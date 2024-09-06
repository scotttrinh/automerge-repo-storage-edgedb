import type { Executor } from "edgedb";
import type {
  StorageAdapterInterface,
  StorageKey,
  Chunk,
} from "@automerge/automerge-repo/slim";

export class EdgeDBStorageAdapter implements StorageAdapterInterface {
  constructor(
    private client: Executor,
    private keySeparator = "::",
  ) {
    this.client = client;
  }

  async load(keyArray: StorageKey): Promise<Uint8Array | undefined> {
    const key = keyArray.join(this.keySeparator);
    const result = await this.client.querySingle<Uint8Array>(
      `
      with
        key := <str>$key,
        found := (select automerge_repo::Blob filter .key = key),
      select found.data;
    `,
      { key },
    );
    return result ?? undefined;
  }

  async save(keyArray: StorageKey, data: Uint8Array): Promise<void> {
    const key = keyArray.join(this.keySeparator);
    await this.client.query(
      `
      with
        key := <str>$key,
        data := <bytes>$data,
      insert automerge_repo::Blob {
        key := key,
        data := data,
      }
      unless conflict on .key
      else (
        update automerge_repo::Blob
        set {
          data := data,
        }
      );
    `,
      { key, data },
    );
  }

  async remove(keyArray: StorageKey): Promise<void> {
    const key = keyArray.join(this.keySeparator);
    await this.client.query(
      `
      with
        key := <str>$key,
        blob := (select automerge_repo::Blob filter .key = key),
      delete blob;
    `,
      { key },
    );
  }

  async loadRange(keyPrefix: StorageKey): Promise<Chunk[]> {
    const prefix = keyPrefix.join(this.keySeparator);
    const result = await this.client.query<{
      key: string;
      data: Uint8Array | null;
    }>(
      `
      with
        prefix := <str>$prefix,
        found := (select automerge_repo::Blob filter .key LIKE prefix ++ "%"),
      select found { key, data };
    `,
      { prefix },
    );
    return result.map(({ key, data }) => ({
      key: key.split(this.keySeparator),
      data: data ?? undefined,
    }));
  }

  async removeRange(keyPrefix: StorageKey): Promise<void> {
    const prefix = keyPrefix.join(this.keySeparator);
    await this.client.query(
      `
      with
        prefix := <str>$prefix,
        blobs := (select automerge_repo::Blob filter .key LIKE prefix ++ "%"),
      delete blobs;
    `,
      { prefix },
    );
  }
}

# EdgeDB Automerge Repo Storage Adapter

Use EdgeDB on the backend to store your Automerge repo.

## Setup

Add the following EdgeDB schema to your project:

```esdl
module automerge_repo {
    type Blob {
        required key: str {
            constraint exclusive;
        }

        data: bytes;
    }
}
```

## Usage

This adapter is meant to be used server-side and requires an EdgeDB client instance.

```ts
import { Repo } from "@automerge/automerge-repo";
import { createClient } from "edgedb";
import { EdgeDBStorageAdapter } from "automerge-repo-storage-edgedb";

const client = createClient();

const repo = new Repo({
  storage: new EdgeDBStorageAdapter(client),
});
```

module automerge_repo {
    type Blob {
        required key: str {
            constraint exclusive;
        }

        data: bytes;
    }
}

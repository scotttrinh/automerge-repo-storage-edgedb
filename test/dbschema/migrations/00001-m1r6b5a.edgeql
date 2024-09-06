CREATE MIGRATION m1r6b5a2g2csky2onyfzae5dsegahcazbwhgbkopdzeeqtc6iycteq
    ONTO initial
{
  CREATE MODULE automerge_repo IF NOT EXISTS;
  CREATE TYPE automerge_repo::Blob {
      CREATE PROPERTY data: std::bytes;
      CREATE REQUIRED PROPERTY key: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};

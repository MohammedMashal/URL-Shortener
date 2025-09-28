/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("urls", {
    id: "id",
    original_url: { type: "text", notNull: true },
    short_code: { type: "varchar(8)", unique: true, notNull: true },
    created_at: {
      type: "timestamp with time zone",
      default: pgm.func("now()"),
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
  });
  pgm.createIndex("urls", "short_code");
  pgm.createIndex("urls", "user_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex("urls", "short_code");
  pgm.dropIndex("urls", "user_id");
  pgm.dropTable("urls");
};

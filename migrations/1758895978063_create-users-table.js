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
  pgm.createTable("users", {
    id: "id",
    name: { type: "varchar(50)", notNull: true },
    email: { type: "varchar(50)", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    password_changed_at: {
      type: "timestamp with time zone",
      default: pgm.func("now()"),
      notNull: true,
    },
    password_reset_token: "text",
    password_reset_expires: "timestamp with time zone",
    created_at: {
      type: "timestamp with time zone",
      default: pgm.func("now()"),
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("users");
};

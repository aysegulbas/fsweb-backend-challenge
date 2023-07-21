/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("user_id");
      tbl.string("username").notNullable().unique();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.string("email");
      tbl.string("password").notNullable();
    })
    .createTable("tweets", (tbl) => {
      tbl.increments("tweet_id");
      tbl
        .integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      tbl.string("content").notNullable();

      tbl.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("retweets", (tbl) => {
      tbl.increments("id");

      tbl
        .integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      tbl
        .integer("tweet_id")
        .notNullable()
        .references("tweet_id")
        .inTable("tweets")
        .onDelete("CASCADE");
    })
    .createTable("likes", (tbl) => {
      tbl.increments("id");
      tbl
        .integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      tbl
        .integer("tweet_id")
        .notNullable()
        .references("tweet_id")
        .inTable("tweets")
        .onDelete("CASCADE");
    })
    .createTable("relations", (tbl) => {
      tbl.increments("id");
      tbl
        .integer("follower_id")
        .defaultTo(0)
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      tbl
        .integer("following_id")
        .defaultTo(0)
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("relations")
    .dropTableIfExists("likes")
    .dropTableIfExists("retweets")
    .dropTableIfExists("tweets")
    .dropTableIfExists("users");
};

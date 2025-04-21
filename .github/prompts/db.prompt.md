When creating or modifying database queries, please adhere to the following conventions:

- Place all query implementations in `app/db/queries`.
- Use the Drizzle ORM for all database interactions.
- Import schema definitions and inferred types from `app/db/schema`.
- Employ async/await syntax and handle errors gracefully.
- Utilize Drizzle’s query builder methods, e.g.:
  - `db.select().from(table)`
  - `db.insert(table).values(...)`
  - `db.update(table).set(...)`
  - `db.delete(table).where(...)`
- Ensure queries return strongly‑typed results by using the `$inferSelect` and `$inferInsert` types.
- Log or rethrow errors as appropriate without leaking sensitive information.

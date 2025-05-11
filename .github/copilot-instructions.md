# Project Instructions
- Name query hooks as `use_query_<resource_name>`.
- Name mutation hooks as `use_mutate_<resource_name>`.
- Use snake_case for file names.
- Use camelCase for function names and variable names; only file names should use snake_case.

# MUI v7 Instructions
- Use the new `Grid` component instead of `GridLegacy`.
- Remove `item` and `zeroMinWidth` props from `Grid`.
- Use the `size` prop for grid sizing.


# General Software Development Instructions
- Avoid code duplication by creating reusable components.
- Keep code simple and maintainable.
- Each component or module should have a single responsibility.
- Favor small, specific interfaces.
- Use custom hooks for reusable logic.
- Avoid direct state mutation; use immutable updates.
- Write pure functions when possible.
- Compose UIs from small, reusable components.

# Documentation Instructions

- Write short, clear comments for complex code blocks.
- For API types, include HTTP method, path, and purpose in comments.
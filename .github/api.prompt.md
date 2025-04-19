Your goal is to generate API-related code for a React application using React Router v7 and TanStack Query.

Ask for the specific type of API code needed (Loader, Action, Resource Route, Query Hook, Mutation Hook), the resource name, API endpoint details (path, method), and relevant data types if not provided.

Requirements for the generated code:

- **Loaders/Actions/Resource Routes (React Router v7):**
  - Use `async function loader()` for data fetching before route rendering.
  - Use `async function action()` for handling data mutations (form submissions, etc.).
  - Use Resource Routes for API-like endpoints serving data directly, typically located within a `routes_api` directory.
  - Reference: [Data Loading](https://reactrouter.com/start/framework/data-loading), [Resource Routes](https://reactrouter.com/start/framework/resource-routes)
- **Client-Side API Hooks (TanStack Query):**
  - All client-side API requests **must** be made using custom hooks built on top of TanStack Query (`useQuery`, `useMutation`).
  - **Always use object parameter syntax for TanStack Query hooks** (e.g., `useQuery({ queryKey: [], queryFn: () => {} })`) rather than positional arguments.
  - The `fetch` functions within these hooks should primarily interact with the application's own Resource Routes defined in the `routes_api` directory.
  - Use `useQuery` for data fetching hooks.
  - Use `useMutation` for data mutation hooks.
  - Follow the naming convention:
    - File names: Use snake_case (e.g., `user_profile.tsx`, `api_service.ts`)
    - Component names: Use camelCase (e.g., `userProfile`, `productList`)
    - Query hooks: `use_query_<resource_name>` (e.g., `use_query_users`)
    - Mutation hooks: `use_mutate_<resource_name>` (e.g., `use_mutate_create_user`)
  - Define clear TypeScript types for request parameters, response data, and query keys.
  - Wrap the TanStack Query hook calls in custom hooks as per the convention.
  - Examples:

    ```typescript
    // Query hook with object parameters
    const useQueryUsers = (options: {
      params?: UserQueryParams;
      queryOptions?: UseQueryOptions<
        User[],
        Error,
        User[],
        ["users", UserQueryParams]
      >;
    }) => {
      const { params = {}, queryOptions = {} } = options;
      return useQuery({
        queryKey: ["users", params],
        queryFn: () => fetchUsers(params),
        ...queryOptions,
      });
    };

    // Mutation hook with object parameters
    const useMutateCreateUser = (
      options?: UseMutationOptions<User, Error, CreateUserPayload>
    ) => {
      return useMutation({
        mutationFn: (userData) => createUser(userData),
        ...options,
      });
    };
    ```
- **TypeScript Types:**
  - Always define TypeScript types for API request payloads and response data.
- **Documentation Comments:**
  - For API-related type definitions, add JSDoc comments specifying:
    - The HTTP method (e.g., `GET`, `POST`).
    - The API path (e.g., `/api/users/{id}`).
    - The utility or purpose of the type (e.g., "Request payload for creating a user").
  - For complex functions or logic, include comments explaining the purpose.

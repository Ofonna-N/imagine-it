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
  - The `fetch` functions within these hooks should primarily interact with the application's own Resource Routes defined in the `routes_api` directory.
  - Use `useQuery` for data fetching hooks.
  - Use `useMutation` for data mutation hooks.
  - Follow the naming convention:
    - Query hooks: `use_query_<resource_name>` (e.g., `use_query_users`)
    - Mutation hooks: `use_mutate_<resource_name>` (e.g., `use_mutate_create_user`)
  - Define clear TypeScript types for request parameters, response data, and query keys.
  - Wrap the TanStack Query hook calls in custom hooks as per the convention.
- **TypeScript Types:**
  - Always define TypeScript types for API request payloads and response data.
- **Documentation Comments:**
  - For API-related type definitions, add JSDoc comments specifying:
    - The HTTP method (e.g., `GET`, `POST`).
    - The API path (e.g., `/api/users/{id}`).
    - The utility or purpose of the type (e.g., "Request payload for creating a user").
  - For complex functions or logic, include comments explaining the purpose.

Example Query Hook Structure:
export const useQueryProducts = (
params: ProductQueryParams = {},
options?: UseQueryOptions<
Product[],
Error,
Product[],
["products", ProductQueryParams]

> ) => {
> // Assumes fetchProducts makes a request to a resource route like /api/products
> return useQuery({

    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    ...options,

});
};

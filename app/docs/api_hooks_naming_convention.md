# API Hooks Naming Convention

This document outlines the naming convention for API hooks in the Imagine-It application.

## TanStack Query Hooks

For data fetching operations using TanStack Query:

- `useQuery[Entity]` - For read operations that fetch data (e.g., `useQueryProducts`)
- `useQueryInfinite[Entity]` - For paginated/infinite scroll data fetching (e.g., `useQueryInfiniteProducts`)

## Mutation Hooks

For data mutation operations using TanStack Query:

- `useMutate[Entity][Action]` - For write operations (e.g., `useMutateProductCreate`)
- Common actions: `Create`, `Update`, `Delete`, `AddTo`, `RemoveFrom`

## Model-specific Business Logic Hooks

For hooks that combine multiple queries/mutations or contain business logic:

- `use[Entity][Action]` - For business logic operations (e.g., `useCartAddItem`)

## Examples

### Query Hooks

- `useQueryProducts` - Fetches a list of products
- `useQueryProduct` - Fetches a single product by ID
- `useQueryFeaturedProducts` - Fetches featured products
- `useQueryOrders` - Fetches a list of orders

### Mutation Hooks

- `useMutateCartAddItem` - Adds an item to the cart
- `useMutateOrderCreate` - Creates a new order
- `useMutateDesignUpdate` - Updates a design

### Business Logic Hooks

- `useCartTotal` - Calculates cart total (combines data from multiple sources)
- `useOrderCheckout` - Handles the checkout process

## Implementation Pattern

```typescript
// Query hook example
export const useQueryProducts = (
  params: ProductQueryParams = {},
  options?: UseQueryOptions<
    Product[],
    Error,
    Product[],
    ["products", ProductQueryParams]
  >
) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    ...options,
  });
};

// Mutation hook example
export const useMutateCartAddItem = () => {
  return useMutation({
    mutationFn: (item: CartItem) => addItemToCart(item),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
```

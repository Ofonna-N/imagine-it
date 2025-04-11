# Printful Catalog API v2 (Beta) Guide

This document provides a summary of the Printful Catalog API v2 based on the official documentation (#fetch). It covers key endpoints, concepts, and use cases.

**Note:** This API version is currently in Beta. Refer to the official [Printful API v2 Documentation](https://developers.printful.com/docs/v2-beta/) (#fetch) for the most up-to-date and complete information, including detailed request/response schemas and the OpenAPI specification.

## 1. Introduction

The Catalog API v2 allows you to retrieve information about products available in the Printful catalog. This includes:

- Product details (descriptions, images).
- Design specifications (placements, techniques, options).
- Pricing information.
- Size guides.
- Availability and stock information.
- Mockup template data.

It's crucial for building product catalogs, dynamic design tools, and displaying accurate product information to end-users.

**Authorization:** All Catalog API v2 endpoints require **OAuth** authorization (#fetch).

**Rate Limiting:** The API has rate limits (typically 120 requests/minute). Check the `X-Ratelimit-*` headers in responses (#fetch).

## 2. Key Concepts

- **Product vs. Variant:**
  - **Product:** Represents a general item (e.g., "Unisex Staple T-Shirt | Bella + Canvas 3001"). Used for browsing.
  - **Variant:** Represents a specific version of a product (e.g., the Bella + Canvas 3001 in Blue, size L). Identified by `catalog_variant_id`. **Use Variant IDs** when creating orders or designs (#fetch).
- **Placements:** Areas on a product where designs can be placed (e.g., `front`, `back`, `embroidery_chest_left`).
- **Techniques:** Printing or embroidery methods available for a placement (e.g., `dtg`, `embroidery`).
- **Layers:** Used within placements to define the actual design files and options (e.g., thread colors for embroidery).
- **Filtering & Sorting:** Endpoints like `GET /v2/catalog-products` support filtering (e.g., by `selling_region_name`) and sorting (e.g., by price) via URL parameters (#fetch).

## 3. Core Endpoints

### 3.1 Retrieving Products

- **`GET /v2/catalog-products`**: Retrieves a paginated list of catalog products. Supports filtering and sorting. Useful for building a browsable product catalog display (#fetch).
- **`GET /v2/catalog-products/{id}`**: Retrieves detailed information about a single catalog product by its ID. Includes placements, techniques, options, etc., needed for design configuration (#fetch).

### 3.2 Getting Pricing

- **`GET /v2/catalog-variants/{id}/prices`**: Retrieves the pricing information for a specific product _variant_ (#fetch).

### 3.3 Checking Availability

- **`GET /v2/catalog-products/{id}/availability`**: Retrieves stock availability information for a specific product (#fetch). You can also filter the main product list by `selling_region_name` for regional availability (#fetch).

### 3.4 Mockups

- **`GET /v2/catalog-products/{id}/mockup-templates`**: Returns positional data for generating your own mockups for a specific catalog product, bypassing the standard Mockup Generator (#fetch).

## 4. Use Cases

- **Building a Product Catalog:** Use `GET /v2/catalog-products` to display available products with images and descriptions (#fetch).
- **Creating a Design Tool:** Use `GET /v2/catalog-products/{id}` to fetch available placements, techniques, and options for a selected product, allowing users to configure their designs (#fetch).
- **Displaying Pricing:** Use `GET /v2/catalog-variants/{id}/prices` to show the cost of specific product variants (#fetch).
- **Showing Stock Status:** Use availability endpoints or filters to inform users about product availability, potentially filtering by region (#fetch).

## 5. Type Definitions / Response Schemas

The API returns data in `application/json` format. While specific TypeScript types are not provided here, the official documentation (#fetch) and the downloadable OpenAPI specification contain detailed schemas for all responses. Key elements often include:

- `id`: Product or Variant ID.
- `title`: Product name.
- `description`: Product description.
- `image_url`: URL for product images.
- `variants`: An array of specific variants for a product.
- `placements`: Details about designable areas.
- `techniques`: Available printing/embroidery methods.
- `options`: Additional configurable options (like thread colors).
- `availability_status`: Stock information.
- `price`: Cost information.

Always refer to the official Printful API v2 documentation (#fetch) for the exact structure and fields available in API responses.

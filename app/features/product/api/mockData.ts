import type { Product } from "../types";

// Mock product data with proper type annotation
export const products: { [key: string]: Product } = {
  "1": {
    id: "1",
    name: "T-Shirt",
    price: 24.99,
    category: "clothing",
    image: "https://placehold.co/500x500/e66/fff?text=T-Shirt",
    description:
      "100% cotton t-shirt, perfect for custom designs. Available in multiple sizes.",
    details: {
      material: "100% Cotton",
      weight: "180 gsm",
      sizes: "S, M, L, XL, XXL",
      care: "Machine wash cold, tumble dry low",
    },
  },
  "2": {
    id: "2",
    name: "Hoodie",
    price: 39.99,
    category: "clothing",
    image: "https://placehold.co/500x500/6e6/fff?text=Hoodie",
    description:
      "Cozy hoodie with kangaroo pocket. Perfect for cool weather and custom designs.",
    details: {
      material: "80% Cotton, 20% Polyester",
      weight: "320 gsm",
      sizes: "S, M, L, XL, XXL",
      care: "Machine wash cold, tumble dry low",
    },
  },
  "3": {
    id: "3",
    name: "Mug",
    price: 14.99,
    category: "accessories",
    image: "https://placehold.co/300x300/66e/fff?text=Mug",
    description: "Ceramic mug perfect for your morning coffee or tea.",
    details: {
      material: "Ceramic",
      capacity: "11oz",
      dishwasher: "Safe",
      microwave: "Safe",
    },
  },
  "4": {
    id: "4",
    name: "Tote Bag",
    price: 19.99,
    category: "accessories",
    image: "https://placehold.co/300x300/e6e/fff?text=Tote+Bag",
    description: "Durable canvas tote bag for shopping or everyday use.",
    details: {
      material: "100% Cotton Canvas",
      size: '15" x 16"',
      handle: '22" drop',
      care: "Machine washable",
    },
  },
  "5": {
    id: "5",
    name: "Phone Case",
    price: 17.99,
    category: "accessories",
    image: "https://placehold.co/300x300/ee6/fff?text=Phone+Case",
    description: "Custom phone case to protect your device in style.",
    details: {
      material: "Durable plastic",
      compatibility: "Various models",
      protection: "Shock-absorbing",
      style: "Slim profile",
    },
  },
  "6": {
    id: "6",
    name: "Poster",
    price: 12.99,
    category: "art",
    image: "https://placehold.co/300x300/6ee/fff?text=Poster",
    description: "High-quality printed poster for your walls.",
    details: {
      material: "Premium paper",
      finish: "Semi-gloss",
      sizes: '11"x17", 18"x24", 24"x36"',
      care: "Avoid direct sunlight",
    },
  },
};

// Default product for when product is not found
export const defaultProduct: Product = {
  id: "0",
  name: "Product Not Found",
  price: 0,
  category: "none",
  image: "https://placehold.co/500x500/ddd/999?text=Not+Found",
  description: "This product could not be found.",
  details: {},
};

// Get all products as an array
export const getAllProducts = (): Product[] => {
  return Object.values(products);
};

// Get product by ID
export const getProductById = (id: string): Product => {
  return id in products ? products[id] : defaultProduct;
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return [products["1"], products["3"], products["2"]];
};

// Filter products by category
export const filterProductsByCategory = (category?: string): Product[] => {
  const allProducts = getAllProducts();
  if (!category) return allProducts;

  return allProducts.filter((product) => product.category === category);
};

import { getProductById } from "../../product/api/mockData";
import type { Design, ImageCanvasObject, TextCanvasObject } from "../types";

// Create sample text object for canvas
// Helper function to generate unique ID using crypto API
const generateUniqueId = (): string => {
  return window.crypto.randomUUID();
};

const createSampleText = (text: string): TextCanvasObject => ({
  id: generateUniqueId(),
  type: "text",
  text,
  x: 100,
  y: 100,
  width: 200,
  height: 30,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
  fontFamily: "Arial",
  fontSize: 24,
  fontWeight: "normal",
  fontStyle: "normal",
  textAlign: "center",
  fill: "#000000",
});

// Create sample image object for canvas
const createSampleImage = (src: string): ImageCanvasObject => ({
  id: generateUniqueId(),
  type: "image",
  src,
  x: 100,
  y: 150,
  width: 200,
  height: 200,
  angle: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
});

// Mock designs data
export const mockDesigns: Design[] = [
  {
    id: "design-1",
    name: "Mountain Landscape",
    createdAt: "2025-03-01T10:30:00Z",
    updatedAt: "2025-03-02T15:45:00Z",
    imageUrl: "https://placehold.co/400x400/3498db/ffffff?text=Mountain+Design",
    previewUrl:
      "https://placehold.co/600x600/3498db/ffffff?text=Mountain+Preview",
    canvasData: {
      width: 500,
      height: 500,
      background: "#ffffff",
      objects: [
        createSampleText("Mountain Adventure"),
        createSampleImage(
          "https://placehold.co/200x200/34495e/ffffff?text=Mountain"
        ),
      ],
    },
    productId: "1", // T-Shirt
    product: getProductById("1"),
    isPublic: true,
    tags: ["nature", "mountains", "landscape"],
  },
  {
    id: "design-2",
    name: "Abstract Pattern",
    createdAt: "2025-02-15T14:20:00Z",
    updatedAt: "2025-02-16T09:10:00Z",
    imageUrl: "https://placehold.co/400x400/e74c3c/ffffff?text=Abstract+Design",
    previewUrl:
      "https://placehold.co/600x600/e74c3c/ffffff?text=Abstract+Preview",
    canvasData: {
      width: 500,
      height: 500,
      background: "#f5f5f5",
      objects: [
        createSampleText("Abstract Art"),
        createSampleImage(
          "https://placehold.co/200x200/9b59b6/ffffff?text=Abstract"
        ),
      ],
    },
    productId: "3", // Mug
    product: getProductById("3"),
    isPublic: true,
    tags: ["abstract", "pattern", "art"],
  },
  {
    id: "design-3",
    name: "Custom Logo",
    createdAt: "2025-01-20T11:15:00Z",
    updatedAt: "2025-01-20T11:15:00Z",
    imageUrl: "https://placehold.co/400x400/2ecc71/ffffff?text=Logo+Design",
    previewUrl: "https://placehold.co/600x600/2ecc71/ffffff?text=Logo+Preview",
    canvasData: {
      width: 500,
      height: 500,
      background: "#ffffff",
      objects: [
        createSampleText("My Company"),
        createSampleImage(
          "https://placehold.co/200x200/f1c40f/ffffff?text=Logo"
        ),
      ],
    },
    isPublic: false,
    tags: ["logo", "business", "branding"],
  },
];

// Get all designs
export const getAllDesigns = (): Design[] => {
  return mockDesigns;
};

// Get public designs
export const getPublicDesigns = (): Design[] => {
  return mockDesigns.filter((design) => design.isPublic);
};

// Get design by ID
export const getDesignById = (id: string): Design | undefined => {
  return mockDesigns.find((design) => design.id === id);
};

// Get designs for a specific product
export const getDesignsByProductId = (productId: string): Design[] => {
  return mockDesigns.filter((design) => design.productId === productId);
};

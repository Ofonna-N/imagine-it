import type { Product } from "~/features/product/types";

// Design types
export interface Design {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  previewUrl: string;
  canvasData: CanvasData;
  productId?: string;
  product?: Product;
  isPublic: boolean;
  tags: string[];
}

// Canvas data for design
export interface CanvasData {
  width: number;
  height: number;
  objects: CanvasObject[];
  background?: string;
}

// Base canvas object type
export interface BaseCanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

// Text object on canvas
export interface TextCanvasObject extends BaseCanvasObject {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textAlign: "left" | "center" | "right";
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

// Image object on canvas
export interface ImageCanvasObject extends BaseCanvasObject {
  type: "image";
  src: string;
  filters?: string[];
}

// Shape object on canvas
export interface ShapeCanvasObject extends BaseCanvasObject {
  type: "rect" | "circle" | "triangle" | "polygon";
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  points?: number[][];
}

// Union type for all canvas objects
export type CanvasObject =
  | TextCanvasObject
  | ImageCanvasObject
  | ShapeCanvasObject;

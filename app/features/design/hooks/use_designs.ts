import { useState, useCallback, useEffect } from "react";

import {
  getAllDesigns,
  getDesignById,
  getDesignsByProductId,
} from "../api/mock_data";
import type { CanvasData, Design } from "../types";

export const useDesigns = (productId?: string) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load designs based on product ID or get all designs
  useEffect(() => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const loadedDesigns = productId
        ? getDesignsByProductId(productId)
        : getAllDesigns();

      setDesigns(loadedDesigns);
      setLoading(false);
    }, 500);
  }, [productId]);

  // Get a specific design by ID
  const getDesign = useCallback((designId: string) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const design = getDesignById(designId);
      if (design) {
        setSelectedDesign(design);
      }
      setLoading(false);
    }, 300);
  }, []);

  // Create a new design
  const createDesign = useCallback(
    (name: string, productId?: string): Design => {
      // Create empty canvas data
      const emptyCanvas: CanvasData = {
        width: 500,
        height: 500,
        background: "#ffffff",
        objects: [],
      };

      // Create new design
      const newDesign: Design = {
        id: `design-${crypto.randomUUID()}`,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl: "https://placehold.co/400x400/cccccc/ffffff?text=New+Design",
        previewUrl:
          "https://placehold.co/600x600/cccccc/ffffff?text=New+Design",
        canvasData: emptyCanvas,
        productId,
        isPublic: false,
        tags: [],
      };

      // Add to designs list (simulating API call)
      setDesigns((prevDesigns) => [...prevDesigns, newDesign]);
      setSelectedDesign(newDesign);

      return newDesign;
    },
    []
  );

  // Update an existing design
  const updateDesign = useCallback(
    (designId: string, updates: Partial<Design>) => {
      setDesigns((prevDesigns) =>
        prevDesigns.map((design) =>
          design.id === designId
            ? { ...design, ...updates, updatedAt: new Date().toISOString() }
            : design
        )
      );

      // Update selected design if it's the one being edited
      if (selectedDesign && selectedDesign.id === designId) {
        setSelectedDesign((prev) =>
          prev
            ? { ...prev, ...updates, updatedAt: new Date().toISOString() }
            : null
        );
      }
    },
    [selectedDesign]
  );

  // Delete a design
  const deleteDesign = useCallback(
    (designId: string) => {
      setDesigns((prevDesigns) =>
        prevDesigns.filter((design) => design.id !== designId)
      );

      // Clear selected design if it's the one being deleted
      if (selectedDesign && selectedDesign.id === designId) {
        setSelectedDesign(null);
      }
    },
    [selectedDesign]
  );

  return {
    designs,
    selectedDesign,
    loading,
    getDesign,
    createDesign,
    updateDesign,
    deleteDesign,
  };
};

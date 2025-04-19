// Enum for available image generation model types
/**
 * Identifier for available replicate image generation models
 * Uses the exact developer/model name as key
 */
export enum ImageGenerationModelType {
  PRUNAAI_HIDREAM_L1_FAST = "prunaai/hidream-l1-fast",
}

const REPLICATE_MODELS = {
  IMAGE_GENERATION: {
    // Map model identifier to replicate model version. Update here to swap models.
    [ImageGenerationModelType.PRUNAAI_HIDREAM_L1_FAST]:
      "prunaai/hidream-l1-fast:17c237d753218fed0ed477cb553902b6b75735f48c128537ab829096ef3d3645",
  },
};

export default REPLICATE_MODELS;

export const MODEL_REGISTRY = {
  "prunaai-fast":
    "prunaai/hidream-l1-fast:17c237d753218fed0ed477cb553902b6b75735f48c128537ab829096ef3d3645",
  "gpt-image-1": "gpt-image-1",
  "dall-e-3": "dall-e-3",
  "new-model": "new-model-value",
} as const;
// const test:ImageModel = ""
// const test: ImageGenerateParams["model"] = ""

export type ModelKey = keyof typeof MODEL_REGISTRY;

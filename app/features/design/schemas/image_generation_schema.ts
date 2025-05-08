import { z } from "zod";

const artStyleOptions = [
  "minimalist",
  "abstract",
  "sketchy",
  "photography",
  "painting",
  "3d render",
  "cinematic",
  "graphic design pop art",
  "creative",
  "fashion",
  "graphic design",
  "moody",
  "bokeh",
  "pro b&w photography",
  "pro color photography",
  "pro film photography",
  "sketch black and white",
  "sketch color",
  "", // For "None (Default)"
] as const;

export const imageGenerationSchema = z.object({
  prompt: z
    .string()
    .min(3, { message: "Prompt cannot be empty." })
    .max(300, { message: "Prompt is too long." }),
  selectedModel: z.enum(["basic", "advanced"], {
    errorMap: () => ({ message: "Please select a model." }),
  }),
  isTransparent: z.boolean().default(false).optional(), // Made optional to align with form logic where it's conditional
  artStyle: z.enum(artStyleOptions).default("").optional(), // Ensured optional and default
  orientation: z.enum(["square", "landscape", "portrait"], {
    errorMap: () => ({ message: "Please select an orientation." }),
  }),
});

export type ImageGenerationFormValues = z.infer<typeof imageGenerationSchema>;

// Utility type for art style options if needed elsewhere
export type ArtStyleUnion = (typeof artStyleOptions)[number];

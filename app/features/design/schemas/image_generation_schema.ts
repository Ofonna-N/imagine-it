import { z } from "zod";

/**
 * Defines the schema for the image generation form.
 */

// Available art styles for image generation
// IMPORTANT: This array is the single source of truth for art styles.
// It is used to generate the ArtStyleUnion type and is also imported by
// the ImageGenerator component to populate the art style selection.
export const artStyleOptions = [
  "", // Represents "None" or "Default"
  "photorealistic",
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
  // --- Added for product art enhancement ---
  "watercolor",
  "vintage",
  "cartoon",
  "line art",
  "sticker",
  "retro",
  "pop surrealism",
  "kawaii",
  "vaporwave",
  "geometric",
  "collage",
  "embroidery",
  "pixel art",
  "graffiti",
  "tattoo",
  "comic book",
  "flat design",
  "isometric",
  "low poly",
  "chalk art",
  "neon",
  "psychedelic",
  "folk art",
  "doodle",
  "woodcut",
  "oil painting",
  "digital painting",
  "impressionist",
  "expressionist",
  "surrealist",
  "art nouveau",
  "art deco",
  "cubism",
  "baroque",
  "pop art",
  "stained glass",
  "origami",
  "paper cut",
  "embossed",
  "monochrome",
  "duotone",
  "pastel",
  "bold colors",
  "soft colors",
  "high contrast",
  "metallic",
  "glossy",
  "matte",
  // --- End enhancement ---
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
  artStyle: z.array(z.enum(artStyleOptions)).default([]).optional(), // Now supports multiple styles
  orientation: z.enum(["square", "landscape", "portrait"], {
    errorMap: () => ({ message: "Please select an orientation." }),
  }),
});

export type ImageGenerationFormValues = Omit<
  z.infer<typeof imageGenerationSchema>,
  "artStyle"
> & {
  artStyle?: ArtStyleUnion[];
};

// Utility type for art style options if needed elsewhere
export type ArtStyleUnion = (typeof artStyleOptions)[number];

// Enhancement prompts for each art style to improve AI image generation quality
export const artStyleEnhancements: Record<ArtStyleUnion, string> = {
  "": "",
  photorealistic:
    "highly detailed, ultra-realistic, sharp focus, natural lighting, photographic quality",
  minimalist:
    "minimal details, clean lines, simple shapes, lots of negative space, modern aesthetic",
  abstract:
    "abstract composition, expressive shapes, bold colors, creative interpretation, non-representational",
  sketchy:
    "hand-drawn, loose sketch lines, pencil or ink, unfinished look, artistic",
  photography:
    "realistic, camera shot, natural lighting, depth of field, photographic style",
  painting:
    "painterly texture, visible brushstrokes, traditional painting style, rich colors",
  "3d render":
    "3D model, realistic lighting, rendered in high detail, digital art, depth and perspective",
  cinematic:
    "cinematic lighting, dramatic composition, film still, wide aspect ratio, storytelling",
  "graphic design pop art":
    "bold outlines, vibrant pop colors, graphic design, pop art style, comic influence",
  creative: "imaginative, unique, original, inventive, artistic flair",
  fashion: "fashion illustration, stylish, trendy, elegant, runway-inspired",
  "graphic design":
    "vector shapes, clean lines, modern design, digital illustration",
  moody: "moody lighting, dramatic shadows, emotional atmosphere, deep tones",
  bokeh: "soft background, bokeh effect, shallow depth of field, dreamy look",
  "pro b&w photography":
    "professional black and white, high contrast, sharp details, classic photography",
  "pro color photography":
    "professional color, vibrant tones, sharp details, studio lighting",
  "pro film photography":
    "film grain, vintage tones, analog look, cinematic colors",
  "sketch black and white":
    "black and white sketch, pencil or ink, hand-drawn, artistic lines",
  "sketch color":
    "colored sketch, hand-drawn, colored pencils or markers, artistic lines",
  watercolor:
    "watercolor texture, soft edges, flowing colors, hand-painted, artistic splashes",
  vintage:
    "vintage style, retro colors, aged paper, nostalgic, old-fashioned look",
  cartoon:
    "cartoon style, bold outlines, exaggerated features, playful, colorful",
  "line art": "clean line art, monochrome, vector lines, minimal shading",
  sticker: "sticker style, white outline, bold colors, playful, cut-out look",
  retro: "retro style, 80s or 90s colors, nostalgic, vintage design elements",
  "pop surrealism":
    "pop surrealism, imaginative, dreamlike, unexpected juxtapositions",
  kawaii: "kawaii style, cute, pastel colors, big eyes, adorable characters",
  vaporwave:
    "vaporwave style, neon colors, 80s-90s digital, surreal, retro-futuristic",
  geometric: "geometric shapes, symmetry, abstract patterns, clean lines",
  collage: "collage style, mixed media, cut and paste, layered textures",
  embroidery: "embroidery texture, stitched look, textile art, thread details",
  "pixel art": "pixel art, low resolution, 8-bit style, retro video game look",
  graffiti: "graffiti art, spray paint, urban style, bold colors, street art",
  tattoo: "tattoo style, bold outlines, traditional tattoo motifs, inked look",
  "comic book":
    "comic book style, halftone dots, speech bubbles, dynamic action",
  "flat design": "flat design, minimal shading, bold colors, modern aesthetic",
  isometric: "isometric perspective, 3D look, geometric shapes, clean lines",
  "low poly": "low poly, faceted shapes, 3D geometric, minimal detail",
  "chalk art": "chalk texture, hand-drawn, on blackboard, dusty look",
  neon: "neon colors, glowing lines, dark background, vibrant lighting",
  psychedelic:
    "psychedelic art, vibrant colors, swirling patterns, surreal imagery",
  "folk art":
    "folk art style, traditional motifs, hand-crafted look, bright colors",
  doodle: "doodle art, playful, hand-drawn, spontaneous lines, whimsical",
  woodcut: "woodcut print, bold lines, high contrast, traditional printmaking",
  "oil painting":
    "oil painting texture, rich colors, visible brushstrokes, classic art",
  "digital painting":
    "digital painting, smooth gradients, painterly effects, modern art",
  impressionist:
    "impressionist style, visible brushstrokes, light and color, soft edges",
  expressionist:
    "expressionist style, emotional, bold colors, dynamic brushwork",
  surrealist: "surrealist art, dreamlike, imaginative, unexpected elements",
  "art nouveau": "art nouveau, flowing lines, floral motifs, elegant curves",
  "art deco": "art deco, geometric patterns, metallic colors, 1920s style",
  cubism: "cubist style, fragmented shapes, multiple perspectives, abstract",
  baroque: "baroque style, ornate, dramatic lighting, rich details",
  "pop art": "pop art, bold colors, comic style, mass culture imagery",
  "stained glass":
    "stained glass effect, bold outlines, vibrant colors, translucent look",
  origami: "origami style, folded paper, geometric shapes, crisp edges",
  "paper cut": "paper cut art, layered paper, shadow effects, hand-crafted",
  embossed: "embossed texture, raised details, tactile look",
  monochrome: "monochrome, single color, high contrast, minimal shading",
  duotone: "duotone, two contrasting colors, graphic look",
  pastel: "pastel colors, soft tones, gentle look, light palette",
  "bold colors": "bold, saturated colors, high impact, eye-catching",
  "soft colors": "soft, muted colors, gentle palette, calming look",
  "high contrast": "high contrast, strong light and shadow, dramatic effect",
  metallic: "metallic effect, shiny surfaces, reflective, chrome or gold",
  glossy: "glossy finish, shiny, reflective surfaces, polished look",
  matte: "matte finish, non-reflective, soft texture, elegant look",
};

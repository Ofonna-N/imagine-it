// --- Product Option Types ---
//
// The Printful API expects product_options to be a discriminated union by name,
// but the UI may generate generic { name: string, value: string | number | boolean } objects.
// To allow this, add a fallback type to the union for unknown options.

export type ProductOption =
  | InsidePocketOption
  | StitchColorOption
  | NotesOption
  | LifelikeOption
  | CustomBorderColorOption
  | KnitwearBaseColor
  | KnitwearTrimColor
  | KnitwearColorReductionMode
  | GenericProductOption; // fallback for unknown/other options

export interface InsidePocketOption {
  name: "inside_pocket";
  value: boolean;
}
export interface StitchColorOption {
  name: "stitch_color";
  value: string;
}
export interface NotesOption {
  name: "notes";
  value: string;
}
export interface LifelikeOption {
  name: "lifelike";
  value: boolean;
}
export interface CustomBorderColorOption {
  name: "custom_border_color";
  value: string;
}
export interface KnitwearBaseColor {
  name: "base_color";
  value: string;
}
export interface KnitwearTrimColor {
  name: "trim_color";
  value: string;
}
export interface KnitwearColorReductionMode {
  name: "color_reduction_mode";
  value: "pixelated";
}
/**
 * Fallback for unknown product options.
 * Allows the UI to pass generic { name, value } objects for options not explicitly typed above.
 */
export interface GenericProductOption {
  name: string;
  value: string | number | boolean;
}

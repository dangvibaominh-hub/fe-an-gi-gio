const LEGACY_GEMINI_IMAGE_MARKER = "/images/recipes/gemini-generated.png";
const PLACEHOLDER_IMAGE_PATH = "/images/recipes/placeholder.avif";

export function resolveRecipeImage(image: string) {
  // The legacy Gemini value is a database marker, not a real generated image.
  // Actual Gemini images are uploaded to Supabase and have their own URL.
  if (image === LEGACY_GEMINI_IMAGE_MARKER || image.trim().length === 0) {
    return PLACEHOLDER_IMAGE_PATH;
  }

  return image;
}

const GEMINI_IMAGE_PATH = "/images/recipes/gemini-generated.png";
const GEMINI_FALLBACK_IMAGE_PATH = "/images/recipes/placeholder.png";

export function resolveRecipeImage(image: string) {
  if (!image) {
    return image;
  }

  if (image === GEMINI_IMAGE_PATH) {
    return GEMINI_FALLBACK_IMAGE_PATH;
  }

  return image;
}

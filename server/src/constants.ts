import path from "path";

export const IMAGES_DIR_NAME = "images";
export const IMAGES_DIR_PATH = path.join(process.cwd(), IMAGES_DIR_NAME);
export const SIGNALS = ["SIGINT", "SIGTERM", "SIGHUP"] as const;
export const IMAGE_MIMES = {
  "image/gif": "gif",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export const REDIS_IMAGES_KEY = "images";

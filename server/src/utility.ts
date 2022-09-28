import { encode } from "blurhash";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import { Server } from "http";
import { diskStorage } from "multer";
import sharp from "sharp";
import { IMAGE_MIMES, SIGNALS } from "./constants";
import { HttpError } from "./model";
import redisClient from "./redis-client";
import { IImage } from "./types";

/**
 * It closes the server and redis connection, and then exits the process
 * @param {"SIGINT" | "SIGTERM" | "SIGHUP"} signal - The signal that was received.
 * @param {Server} server - The Server that is running.
 */
export async function shutdown({
  signal,
  server,
}: {
  signal: typeof SIGNALS[number];
  server: Server;
}) {
  console.info(`Got signal ${signal} Good bye.`);
  await redisClient.disconnect();
  server.close(() => {
    process.exit(0);
  });
}

/**
 * It takes a number of megabytes and returns the number of bytes
 * @param {number} mb - The maximum file size in megabytes.
 */
export const maxFileSize = (mb: number) => mb * 1000000;

/**
 * It generates a random string of a given length, or a random UUID if no length is given
 * @param {number} [size] - The size of the string to be generated.
 * @returns A random string of characters.
 */
export function nanoid(size?: number): string {
  if (size && size <= 256) {
    const random = Math.floor(Math.random() * (256 - 1 + 1) + 1);
    const arr = Array.from({ length: size }, (_, i) => i * random);
    return arr.reduce(
      (t, e) =>
        (t +=
          (e &= 63) < 36
            ? e.toString(36)
            : e < 62
            ? (e - 26).toString(36).toUpperCase()
            : e > 62
            ? "-"
            : "_"),
      ""
    );
  }
  return randomUUID();
}

/**
 * It takes a path to an image, resizes it to a given size, and returns a blurhash string
 * @param {string} path - The path to the image you want to encode
 * @param size - { height: number; width: number }
 */
export const encodeImageToBlurhash = (
  path: string,
  size: { height: number; width: number }
): Promise<string> =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(size.width, size.height, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });

/**
 * It creates a storage engine for multer that stores files in the specified directory and gives them a
 * random name
 * @param {string} dest - The destination folder where the image will be stored.
 * @returns A function that takes a destination as an argument and returns a function that takes a
 * destination, filename, and callback as arguments.
 */
export const diskStore = (dest: string) => {
  return diskStorage({
    destination(_, __, cb) {
      mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename(_, file, cb) {
      if (!(file.mimetype in IMAGE_MIMES)) {
        return cb(new HttpError("Invalid image type", 422), "");
      }
      const ext = IMAGE_MIMES[file.mimetype as keyof typeof IMAGE_MIMES];
      const gId = nanoid(6);
      const imageName = `${gId}.${ext}`;
      cb(null, imageName);
    },
  });
};

/**
 * If the object has the properties url, blurHash, width, and height, and they are all of the correct
 * type, then the object is an IImage.
 * @param {any} image - any - This is the object that we're checking to see if it's an image.
 * @returns A function that takes in an image and returns a boolean.
 */
export function isImage(image: any): image is IImage {
  return (
    "url" in image &&
    typeof image.url === "string" &&
    "blurHash" in image &&
    typeof image.blurHash === "string" &&
    "width" in image &&
    typeof image.width === "number" &&
    "height" in image &&
    typeof image.height === "number"
  );
}

/**
 * It checks if the images parameter is an array of IImage objects.
 * @param {any} images - any - this is the parameter that we're checking.
 * @returns A function that takes an argument of any type and returns a boolean.
 */
export function isImageArray(images: any): images is IImage[] {
  return Array.isArray(images) && images.length > 0 && isImage(images[0]);
}

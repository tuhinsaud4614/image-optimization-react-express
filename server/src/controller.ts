import { RequestHandler } from "express";
import { existsSync, unlinkSync } from "fs";
import sharp from "sharp";

import { IMAGES_DIR_NAME, REDIS_IMAGES_KEY } from "./constants";
import { HttpError } from "./model";
import redisClient from "./redis-client";
import { IImage } from "./types";
import { encodeImageToBlurhash, isImageArray, nanoid } from "./utility";

/**
 * It takes a file from the request, saves it to the file system, generates a blurhash for it, and
 * saves the image to Redis
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 * @returns An array of images
 */
export const sendImage: RequestHandler = async (req, res, next) => {
  const file = req.file as Express.Multer.File;

  try {
    const imagePath = file.path;
    const image = await sharp(imagePath);
    const { height, width } = await image.metadata();

    if (!height || !width) {
      throw new Error("Image upload failed");
    }

    const oldImages = await redisClient.get(REDIS_IMAGES_KEY);

    if (oldImages && !isImageArray(JSON.parse(oldImages))) {
      throw new Error("Image upload failed");
    }

    const blurHash = await encodeImageToBlurhash(imagePath, { height, width });

    const newImage: IImage = {
      id: nanoid(6),
      url: `${IMAGES_DIR_NAME}/${file.filename}`,
      blurHash,
      width,
      height,
    };

    const newImages = oldImages
      ? [...JSON.parse(oldImages), newImage]
      : [newImage];

    await redisClient.set(REDIS_IMAGES_KEY, JSON.stringify(newImages));

    res.status(201).json({
      image: newImage,
    });
  } catch (error) {
    console.log(error);
    if (existsSync(file.path)) {
      unlinkSync(file.path);
    }
    return next(new HttpError("Failed to upload message", 400));
  }
};

/**
 * It fetches images from Redis and returns them to the client
 * @param _ - RequestHandler: This is the request object.
 * @param res - The response object.
 * @param next - This is a function that we can call to pass control to the next middleware function in
 * the stack.
 * @returns An array of images
 */
export const getImages: RequestHandler = async (_, res, next) => {
  try {
    const images = await redisClient.get(REDIS_IMAGES_KEY);

    if (!images || !isImageArray(JSON.parse(images))) {
      return res.status(201).json({
        images: [],
      });
    }

    res.status(201).json({
      images: JSON.parse(images),
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Images fetching failed", 400));
  }
};

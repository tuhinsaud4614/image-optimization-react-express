import { Router } from "express";
import { IMAGES_DIR_PATH } from "./constants";
import { getImages, sendImage } from "./controller";
import { imageUpload, validateRequest } from "./middleware";
import { uploadImageValidateSchema } from "./schema";
import { maxFileSize } from "./utility";

const router = Router();

router.post(
  "/images/upload",
  imageUpload(maxFileSize(5), IMAGES_DIR_PATH).single("image"),
  validateRequest(uploadImageValidateSchema, 422),
  sendImage
);

router.get("/images", getImages);

export default router;

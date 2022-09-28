import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AnySchema, ValidationError } from "yup";
import { IMAGE_MIMES } from "./constants";
import { HttpError } from "./model";
import { diskStore, maxFileSize } from "./utility";

/**
 * It returns a multer middleware that limits the file size to the maxSize parameter, and optionally
 * stores the file in the dest parameter
 * @param {number} [maxSize=1] - The maximum file size in megabytes.
 * @param {string} [dest] - The destination folder for the uploaded file. If not provided, the file
 * will be stored in memory.
 * @returns A function that takes in two parameters, maxSize and dest.
 */
export const imageUpload = (
  maxSize: number = maxFileSize(1),
  dest?: string
) => {
  return multer({
    limits: { fileSize: maxSize },
    storage: dest ? diskStore(dest) : undefined,
    fileFilter(_, file, cb) {
      if (!(file.mimetype in IMAGE_MIMES)) {
        return cb(new HttpError("Invalid image type", 422));
      }
      cb(null, true);
    },
  });
};

/**
 * It takes a Joi schema and a status code, and returns a middleware function that validates the
 * request against the schema and throws an error if the validation fails
 * @param {AnySchema} schema - AnySchema - The schema to validate the request against.
 * @param {number} [code=500] - The HTTP status code to return if the validation fails.
 * @returns A function that takes in a request, response, and next function.
 */
export const validateRequest = (schema: AnySchema, code: number = 500) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
        files: req.files,
      });
      return next();
    } catch (er) {
      const { message } = er as ValidationError;
      return next(new HttpError(message, code));
    }
  };
};

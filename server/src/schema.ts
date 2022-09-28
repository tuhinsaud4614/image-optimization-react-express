import * as yup from "yup";
import { IMAGE_MIMES } from "./constants";
import { maxFileSize } from "./utility";

export const uploadImageValidateSchema = yup.object().shape({
  file: yup
    .mixed<Express.Multer.File>()
    .required("Image is required.")
    .test("fileFormat", "Invalid image type", (value) => {
      return !!value && "mimetype" in value && value.mimetype in IMAGE_MIMES;
    })
    .test(
      "fileSize",
      "Image size greater than 5mb",
      (value) => !!value && value.size <= maxFileSize(5)
    ),
});

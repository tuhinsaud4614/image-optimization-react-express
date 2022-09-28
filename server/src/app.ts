import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { unlink } from "fs";
import { MulterError } from "multer";
import { IMAGES_DIR_PATH, SIGNALS } from "./constants";
import { HttpError } from "./model";
import router from "./route";
import { shutdown } from "./utility";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/images", express.static(IMAGES_DIR_PATH));
app.use("/", router);

// No route found
app.use((_: Request, __: Response, next: NextFunction) => {
  const error = new HttpError("Could not found this route", 404);
  next(error);
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    console.warn("Header already sent");
    return next(err);
  }

  if (err instanceof MulterError) {
    if (req.file) {
      unlink(req.file.path, (linkErr) => {
        if (linkErr) {
          console.error(linkErr?.message);
        }
      });
    }

    console.error(err.message);
    res.status(400).json({ code: 400, message: err.message });
    return;
  }

  if (err instanceof HttpError) {
    console.error(err.message);
    res.status(err.code).json({ code: err.code, message: err.message });
    return;
  }

  console.error(err.message);
  const result = new HttpError("Something went wrong", 500);
  res.status(500).json({ code: result.code, message: result.message });
});

async function startServer() {
  const server = app.listen(4000, () => {
    console.log("App running on http://localhost:4000");
  });

  SIGNALS.forEach((signal) => {
    process.on(signal, () => shutdown({ signal, server }));
  });
}

startServer();

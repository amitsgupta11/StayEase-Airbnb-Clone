import multer from "multer";
import { AppError } from "../utils/response.utils.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  ["image/jpeg","image/jpg","image/png","image/webp"].includes(file.mimetype)
    ? cb(null, true) : cb(new AppError("Only JPEG, PNG, WebP allowed.", 400), false);
};

const handler = (upload) => (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") return next(new AppError("File too large. Max 5MB.", 400));
      if (err.code === "LIMIT_FILE_COUNT") return next(new AppError("Max 10 images allowed.", 400));
      return next(new AppError(err.message, 400));
    }
    if (err) return next(err);
    next();
  });
};

export const handleUploadSingle = handler(
  multer({ storage, fileFilter, limits:{ fileSize:5*1024*1024 } }).single("avatar")
);
export const handleUploadMultiple = handler(
  multer({ storage, fileFilter, limits:{ fileSize:5*1024*1024, files:10 } }).array("images", 10)
);

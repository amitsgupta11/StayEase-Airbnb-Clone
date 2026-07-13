// import { v2 as cloudinary } from "cloudinary";

// // Direct config — env se nahi
// cloudinary.config({
//   cloud_name: "de9wrmubf",
//   api_key:    "911271169159122",
//   api_secret: "1CFoYjbMP_VpbBG9UOh5HZISuyY",
//   secure: true,
// });



import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const streamUpload = (buffer, options) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
  if (err) {
    console.error("===== CLOUDINARY ERROR =====");
    console.error(err);
    console.error("===========================");
    return reject(err);
  }

  resolve({
    url: result.secure_url,
    public_id: result.public_id,
  });
  });
  const r = new Readable();
  r.push(buffer);
  r.push(null);
  r.pipe(stream);
});

export const uploadToCloudinary = (buffer, folder="airbnb-clone/listings") =>
  streamUpload(buffer, { folder, resource_type:"image",
    transformation:[{width:1200,height:800,crop:"limit"},{quality:"auto:good"},{fetch_format:"auto"}] });

export const uploadAvatar = (buffer) =>
  streamUpload(buffer, { folder:"airbnb-clone/avatars", resource_type:"image",
    transformation:[{width:400,height:400,crop:"fill",gravity:"face"},{quality:"auto:good"}] });

export const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  try { await cloudinary.uploader.destroy(public_id); }
  catch(e) { console.error("Cloudinary delete error:", e.message); }
};

export const deleteMultipleFromCloudinary = (ids=[]) =>
  Promise.all(ids.filter(Boolean).map(deleteFromCloudinary));

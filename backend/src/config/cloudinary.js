import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "de9wrmubf",
  api_key:    "911271169159122", 
  api_secret: "1CFoYjbMP_VpbBG9UOh5HZISuyY",
  secure: true,
});

export default cloudinary;
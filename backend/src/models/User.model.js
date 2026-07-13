import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name:  { type: String, required: [true,"Name required"], trim: true, minlength:2, maxlength:50 },
  email: { type: String, required: [true,"Email required"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true,"Password required"], minlength:6, select: false },
  role: { type: String, enum:["user","host","admin"], default:"user" },
  avatar: { url:{ type:String, default:"" }, public_id:{ type:String, default:"" } },
  phone: { type: String, default:"" },
  bio:   { type: String, default:"", maxlength:300 },
  isVerified: { type: Boolean, default: false },
  refreshToken:        { type: String, select: false },
  verifyToken:         { type: String, select: false },
  verifyTokenExpires:  { type: Date,   select: false },
  resetPasswordToken:  { type: String, select: false },
  resetPasswordExpires:{ type: Date,   select: false },
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);

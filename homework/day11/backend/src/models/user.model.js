import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    personal: String,
    prefer: String,
    pwd: String,
    phone: String,
    token: String,
    og: Object,
  },
  { collection: "User" }
);

export const User = mongoose.model("User", UserSchema);
// export const Token = mongoose.model("Token", TokenSchema, "Token");

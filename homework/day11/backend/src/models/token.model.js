import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  phone: String,
  token: String,
  isAuth: Boolean,
});

export const Token = mongoose.model("Token", TokenSchema);
// export const Token = mongoose.model("Token", TokenSchema, "Token");

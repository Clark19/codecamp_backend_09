import mongoose from "mongoose";

const StarbucksSchema = new mongoose.Schema(
  {
    // _id: String,
    name: String,
    img: String,
  },
  { collection: "Starbucks" }
);

export const Starbucks = mongoose.model("Starbucks", StarbucksSchema);
// export const Token = mongoose.model("Token", TokenSchema, "Token");

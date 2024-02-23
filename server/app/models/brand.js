import mongoose from "mongoose"; // Erase if already required

var BrandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//Export the model
const brand = mongoose.model("brand", BrandSchema);
export default brand;

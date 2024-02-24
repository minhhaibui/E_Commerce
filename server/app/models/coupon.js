import mongoose from "mongoose"; // Erase if already required

var couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
const coupon = mongoose.model("coupon", couponSchema);
export default coupon;

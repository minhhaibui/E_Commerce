import mongoose from "mongoose"; // Erase if already required

var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    status: {
      type: String,
      default: "Processing",
      enum: ["Cancelled", "Processing", "Successed"],
    },
    total: Number,
    coupon: { type: mongoose.Types.ObjectId, ref: "coupon" },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
const order = mongoose.model("order", orderSchema);
export default order;

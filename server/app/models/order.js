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
      default: "processing",
      enum: ["Cancelled", "Processing", "Successed"],
    },
    paymentIntent: {},
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

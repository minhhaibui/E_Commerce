import userRouter from "./user.js";
import productRouter from "./product.js";
import productCategoryRouter from "./productCategory.js";
import blogCategoryRouter from "./blogCategory.js";
import blogRouter from "./blog.js";
import brandRouter from "./brand.js";
import couponRouter from "./coupon.js";
import orderRouter from "./order.js";

import { notFound, errHandler } from "../app/middlewares/errhandler.js";
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/prodcategory", productCategoryRouter);
  app.use("/api/blogcategory", blogCategoryRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", orderRouter);

  app.use(notFound);
  app.use(errHandler);
};
export { initRouter };

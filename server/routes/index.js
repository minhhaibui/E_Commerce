import userRouter from "./user.js";
import productRouter from "./productCategory.js";
import productCategoryRouter from "./productCategory.js";
import blogCategoryRouter from "./blogCategory.js";
import { notFound, errHandler } from "../app/middlewares/errhandler.js";
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/prodcategory", productCategoryRouter);
  app.use("/api/blogcategory", blogCategoryRouter);

  app.use(notFound);
  app.use(errHandler);
};
export { initRouter };

import userRouter from "./user.js";
import productRouter from "./product.js";
import { notFound, errHandler } from "../app/middlewares/errhandler.js";
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use(notFound);
  app.use(errHandler);
};
export { initRouter };

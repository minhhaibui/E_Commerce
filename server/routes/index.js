import userRouter from "./user.js";
import { notFound, errHandler } from "../app/middlewares/errhandler.js";
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use(notFound);
  app.use(errHandler);
};
export { initRouter };

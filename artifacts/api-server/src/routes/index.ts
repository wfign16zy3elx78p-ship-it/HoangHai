import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingRouter from "./booking";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingRouter);

export default router;

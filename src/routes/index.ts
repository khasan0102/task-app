import { Router } from "express"
import sampleRouter from "./sample"
import userRouter from "./user";
import { langMiddleware } from "../middlewares/lang";

const router = Router({ mergeParams: true })

router.use(langMiddleware)
router.use("/sample", sampleRouter)
router.use("/user", userRouter)

export default router

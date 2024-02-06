import { Router } from "express";
import { togglePremium } from "../controllers/user.controller.js";
import isValidMongoId from "../middlewares/validate-mongoId.middleware.js";

const router = Router();

router.get("/premium/:uid", isValidMongoId("uid"), togglePremium);

export default router;
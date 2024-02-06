import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProductById, deleteProductById } from "../controllers/product.controller.js";
import isValidMongoId from "../middlewares/validate-mongoId.middleware.js";
import { handlePolicies } from "../middlewares/policies.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", [isValidMongoId("pid")], getProductById);
router.post("/", [handlePolicies([ROLES[0], ROLES[1]])], createProduct);
router.put( "/:pid", [isValidMongoId("pid"), handlePolicies([ROLES[0]])], updateProductById);
router.delete( "/:pid", [isValidMongoId("pid"), handlePolicies([ROLES[0], ROLES[1]])], deleteProductById);

export default router;
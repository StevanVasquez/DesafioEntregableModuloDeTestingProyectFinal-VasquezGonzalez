import { Router } from "express";
import { registerUser, recoverUser, resetPassword, userLogin, userLogout, getCurrentUser, githubLogin, getGithubUser } from "../controllers/session.controller.js";
import { passportCall } from "../utils/jwt.js";

const router = Router();

router.post("/register", registerUser);
router.post("/recover", recoverUser);
router.post("/reset", resetPassword);
router.post("/login", userLogin);
router.get("/logout", passportCall("jwt"), userLogout);
router.get("/current", passportCall("jwt"), getCurrentUser);
router.get("/github", passportCall("github"), githubLogin);
router.get("/githubcallback", passportCall("github", { failureRedirect: "/login" }), getGithubUser);

export default router;
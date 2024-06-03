import express from "express";
import { loginGet, loginPost } from "../controllers/loginControllers.js";

const route = express.Router();

route.get("/", loginGet);
route.post("/", loginPost)

export default route;
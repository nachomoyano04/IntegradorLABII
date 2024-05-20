import express from "express";
import { prescribirGet } from "../controllers/prescribirController.js";
import { prescribirPost } from "../controllers/prescribirController.js";

const route = express.Router();

route.get("/", prescribirGet);
route.post("/", prescribirPost);

export default route;
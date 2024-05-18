import express from "express";
import { prescribirGet } from "../controllers/prescribirController.js";

const route = express.Router();

route.get("/", prescribirGet);

export default route;
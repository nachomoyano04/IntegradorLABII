import express from "express";
import { notFound404 } from "../controllers/inicioControllers.js"
const route = express.Router();

route.get("*", notFound404);

export default route;
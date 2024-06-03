import express from "express";
import { getRegistrarUser } from "../controllers/registrarUserController.js";

const route = express.Router();

route.get("/", getRegistrarUser);

export default route;
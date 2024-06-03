import express from "express";
import { getRegistrarUser, postRegistrarUser } from "../controllers/registrarUserController.js";

const route = express.Router();

route.get("/", getRegistrarUser);
route.post("/", postRegistrarUser);

export default route;
import express from "express";
import { registroPrestacionGet } from "../controllers/prestacionesControllers.js";

const route = express.Router();

route.get("/", registroPrestacionGet);

export default route;
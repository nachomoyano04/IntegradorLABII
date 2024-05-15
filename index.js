import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/inicio.js"

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// seteamos para que se pueda usar pug
app.set("view engine", "pug");

// archivos estáticos
app.use(express.static(path.join(__dirname, "public")))

app.use("/", router);


app.listen(PORT, () => {
    console.log(`Server listen in port ${PORT} http://localhost:${PORT}`)
})
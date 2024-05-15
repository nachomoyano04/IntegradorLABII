import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routerInicio from "./routes/inicio.js"
import routerMedico from "./routes/registroMedico.js"
import routerPaciente from "./routes/registroPaciente.js";

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// seteamos para que se pueda usar pug
app.set("view engine", "pug");
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// archivos estáticos

app.use(express.static(path.join(__dirname, "public")))
app.use("/", routerInicio);
app.use("/registrar/medico", routerMedico)
app.use("/registrar/paciente", routerPaciente);

app.listen(PORT, () => {
    console.log(`Server listen in port ${PORT} http://localhost:${PORT}`)
})
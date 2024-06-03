import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routerInicio from "./routes/inicio.js"
import routerMedico from "./routes/registroMedico.js"
import routerPaciente from "./routes/registroPaciente.js";
import routerPrescribir from "./routes/prescribir.js"
import router404 from "./routes/404.js";
import routerLogin from "./routes/autenticacion.js";
import routerRegistrarUser from "./routes/registrarUser.js";
import session from "express-session";

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//agregamos middleware session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {secure:false}
}))

// seteamos para que se pueda usar pug
app.set("view engine", "pug");
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// archivos estáticos
app.use(express.static(path.join(__dirname, "public")))
app.use("/", routerInicio);
app.use("/registrar/medico", routerMedico)
app.use("/registrar/paciente", routerPaciente);
app.use("/prescribir", routerPrescribir)
app.use("/login", routerLogin);
app.use("/registrarUser", routerRegistrarUser);

app.get("*", router404);

app.listen(PORT, () => {
    console.log(`Server listen in port ${PORT} http://localhost:${PORT}`)
})
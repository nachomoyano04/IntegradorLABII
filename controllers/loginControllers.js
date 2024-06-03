import { buscarUsersByUsuarioYPassword, buscarRolesByUsuario } from "../models/login.js";
import bcrypt from "bcrypt";

const loginGet = (req, res) => {
    res.render("login",{});
}

const loginPost = async (req, res) => {
    const usuario = req.body.usuario;
    const password = req.body.password;
    const passwordHasheada = await bcrypt.hash(password, 8);
    // console.log(passwordHasheada);
    // console.log(await bcrypt.compare(password, passwordHasheada));
    if(usuario && password){
        let resultados = await buscarUsersByUsuarioYPassword(usuario, passwordHasheada);
        if(resultados[0].length > 0){
            let idUsuario = resultados[0][0].idUsuario;
            let resultadoRol = await buscarRolesByUsuario(idUsuario); // buscamos el rol/roles que tiene el paciente
            console.log(resultadoRol);
            req.session.loggedin = true;
            req.session.user = usuario;
            req.session.idRol = resultadoRol;
            // res.send(existeUsuarioYPassword[0]);
                // res.redirect("/");
            //Llevar a pagina de inicio y dar mensaje de bienvenida
        }else{
            console.log("USUARIO Y/O CONTRASEÑA INCORRECTOS")
            res.render("login", {})        
        }
    }else{
        console.log("Debe completar los campos usuario y contraseña")
        res.render("login", {})        
        // res.json({mensaje: "Debe completar los campos usuario y contraseña"});
    }
}

export {loginGet, loginPost}
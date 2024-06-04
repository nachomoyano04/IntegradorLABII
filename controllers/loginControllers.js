import { buscarRolesByUsuario, buscarUsersByUsuario } from "../models/login.js";
import bcrypt from "bcrypt";

const loginGet = (req, res) => {
    if(req.session.loggedin){ // si ya esta logueado redirigimos a la pagina de inicio
        res.redirect("/");
    }else{
        res.render("login",{});
    }
}

const loginPost = async (req, res) => {
    const usuario = req.body.usuario;
    const password = req.body.password;
    console.log(usuario, password);
    if(usuario && password){
        let usuarioBD = await buscarUsersByUsuario(usuario);
        if(usuarioBD.length > 0){
            if(await bcrypt.compare(password, usuarioBD[0].password)){
                console.log("Usuario logueado correctamente...");
                req.session.loggedin = true;
                req.session.usuario = usuario;
                const roles = await buscarRolesByUsuario(usuarioBD[0].idUsuario);
                req.session.rol = roles;
                res.send({error:false, mensaje: "¡USUARIO LOGUEADO CORRECTAMENTE!"})
            }else{
                res.send({error: true, mensaje: "Usuario y/o contraseña incorrectos..."})
            }
        }else{
            res.send({error: true, mensaje: "Usuario y/o contraseña incorrectos..."})
        }
    }else{
        res.send({error: true, mensaje: "Debe completar los campos usuario y contraseña"});
    }
}

export {loginGet, loginPost}
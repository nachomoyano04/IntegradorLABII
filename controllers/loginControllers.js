import { buscarRolesByUsuario, buscarUsersByUsuario } from "../models/login.js";
import bcrypt from "bcrypt";
import { getMedicoByIdUsuario } from "../models/medicos.js";

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
    if(usuario && password){
        let usuarioBD = await buscarUsersByUsuario(usuario);
        if(usuarioBD.length > 0){
            if(await bcrypt.compare(password, usuarioBD[0].password)){
                req.session.loggedin = true;
                req.session.usuario = usuario;
                if(usuario != "admin"){
                    const user = await buscarUsersByUsuario(usuario);
                    const medico = await getMedicoByIdUsuario(user[0].idUsuario);
                    req.session.idMedico = medico[0].idMedico;
                }
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
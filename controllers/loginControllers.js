import { buscarUsersByUsuarioYPassword } from "../models/login.js";

const loginGet = (req, res) => {
    res.render("login",{title:""});
}

const loginPost = async (req, res) => {
    const usuario = req.body.usuario;
    const password = req.body.password;
    // const usuario = "admin";
    // const password = "12345";
    if(usuario && password){
        let existeUsuarioYPassword = await buscarUsersByUsuarioYPassword(usuario, password);
        if(existeUsuarioYPassword[0].length > 0){
            res.send(existeUsuarioYPassword[0]);
            //Llevar a pagina de inicio y dar mensaje de bienvenida
        }else{
            console.log("raw")
            res.render("login", {mensaje: "Usuario y/o password incorrectas"})        
        }
    }else{
        res.render("login", {error: true})        
        // res.json({mensaje: "Debe completar los campos usuario y contraseña"});
    }
}

export {loginGet, loginPost}
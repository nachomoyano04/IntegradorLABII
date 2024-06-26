import { getDoctorById} from "../models/medicos.js";

const inicioGet = async(req, res) => {
    if(req.session.loggedin){ // agregar tambien la condicion de rol
        // logica para conseguir el nombre y apellido del usuario
        let usuario = req.session.usuario;
        if(req.session.idMedico){
            const medics = await getDoctorById(req.session.idMedico);
            usuario =  `${medics[0][0].nombre} ${medics[0][0].apellido} REFEPS: ${medics[0][0].idRefeps}`
        }
        const inicio = true;
        let roles = req.session.rol;
        let administrador = false;
        let profesional = false;
        if(roles.length > 1){
            administrador = true;
            profesional = true;
            res.render("inicio", {inicio, administrador, profesional, usuario, esInicio: true});
        }else if(roles[0].idRol === 1){
            administrador = true;
            res.render("inicio", {inicio, administrador,profesional, usuario, esInicio: true});
        }else{
            profesional = true;
            res.render("inicio", {inicio, administrador, profesional, usuario, esInicio: true});
        }
    }else{
        res.redirect("/login");
    }
}

const notFound404 = async(req, res) => {
    res.render("404");
}



export {inicioGet, notFound404}
const inicioGet = async(req, res) => {
    if(req.session.loggedin){ // agregar tambien la condicion de rol
        const inicio = true;
        let roles = req.session.rol;
        let administrador = false;
        let profesional = false;
        if(roles.length > 1){
            administrador = true;
            profesional = true;
            res.render("inicio", {inicio, administrador, profesional, usuario: req.session.usuario, esInicio: true});
        }else if(roles[0].idRol === 1){
            administrador = true;
            res.render("inicio", {inicio, administrador,profesional, usuario: req.session.usuario, esInicio: true});
        }else{
            profesional = true;
            res.render("inicio", {inicio, administrador, profesional, usuario: req.session.usuario, esInicio: true});
        }
    }else{
        // const inicio = false;
        // const mensaje = "No estás logueado en el sistema";
        // res.render("inicio", {inicio, mensaje});
        res.redirect("/login");
    }
}

const notFound404 = async(req, res) => {
    res.render("404");
}



export {inicioGet, notFound404}
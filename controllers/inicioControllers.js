const inicioGet = async(req, res) => {
    if(req.session.loggedin){ // agregar tambien la condicion de rol
        console.log("idRol: "+req.session.idRol);
        const inicio = true;
        res.render("inicio", {inicio})
    }else{
        res.send("debe iniciar sesion");
        // res.render("inicio", {}) //acá mandariamos el mensaje de iniciar sesión primero.
    }
}

const notFound404 = async(req, res) => {
    res.render("404");
}

export {inicioGet, notFound404}
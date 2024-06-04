import express from "express";

const route = express.Router();

route.get("/", (req, res) => {
    if(req.session.loggedin){
        console.log("destruyendo la session")
        try {
            req.session.destroy(error => {
                if(error){
                    throw error;
                }else{
                    console.log("destruida");
                    //mensaje de logout exitoso y redirigir a pagina de login
                    res.redirect("/login");
                }
            })
        } catch (error) {
            res.render("404", {error500: true, mensajeDeError500: error});
        }
    }else{
        res.redirect("/login");
    }
})

export default route;
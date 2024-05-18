const inicioGet = async(req, res) => {
    const inicio = true;
    res.render("inicio", {inicio})
}

export {inicioGet}
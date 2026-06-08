require('dotenv').config();

module.exports = ( req, res, next ) => {
    // captura o token de autorizacao
    const token = req.headers['authorization'];

    if (!token || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ erro: 'Acesso negado!'});
    }
    next(); // token correto, req avança p/ o controller
};
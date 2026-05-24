const express = require('express');
require('dotenv').config();

// importar a config do banco ativa o teste de conex auto
const pool = require('./config/db');
const denunciaRoutes = require('./src/routes/DenunciaRoute'); // importa as rotas

const app = express();

// middleware p/ o express entender requisiçao JSON
app.use(express.json());

// insere as rotas no app com o prefixo /api
app.use('/api', denunciaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// importar a config do banco ativa o teste de conex auto
const pool = require('./config/db');
const denunciaRoutes = require('./src/routes/DenunciaRoute'); // importa as rotas de denuncias
const analyticsRoutes = require('./src/routes/AnalyticsRoute'); // importa as rotas de analytics
const adminRoutes = require('./src/routes/AdminRoutes'); // importa as rotas de admin

const app = express();

// middleware cors
app.use(cors());

// middleware p/ o express entender requisiçao JSON
app.use(express.json());

// insere as rotas no app com o prefixo /api
app.use('/api', denunciaRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
});
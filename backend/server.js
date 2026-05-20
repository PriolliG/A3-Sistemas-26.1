const express = require('express');
require('dotenv').config();

// importar a config do banco ativa o teste de conex auto
const pool = require('./config/db');

const app = express();

// middleware p/ o express entender requisiçao JSON
app.use(express.json());

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
});
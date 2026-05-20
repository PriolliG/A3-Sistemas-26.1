CREATE DATABASE IF NOT EXISTS antigolpes_db;
USE antigolpes_db;
-- DROP DATABASE antigolpes_db;

-- tabela tipos de golpe (cataloga os tipos de fraudes existentes no sistema)
CREATE TABLE tipos_golpe (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE, -- Ex: Clonagem de wpp, falso motoboy
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tabela de telefones (armazena os numeros consultados e seus scores de risco)
CREATE TABLE telefones (
	id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) NOT NULL UNIQUE, -- armazena apenas numeros
    score_risco INT DEFAULT 0, -- valor de 0 a 100
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- tabela de denuncias (registra as ocorrencias de golpes informadas pelo usuario)
CREATE TABLE denuncias (
	id INT AUTO_INCREMENT PRIMARY KEY,
    telefone_id INT NOT NULL,
    tipo_golpe_id INT NOT NULL,
    descricao TEXT NOT NULL,
    data_ocorrencia DATETIME NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (telefone_id) REFERENCES telefones(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_golpe_id) REFERENCES tipos_golpe(id)
);

-- tabela de alertas (registra os alertas automaticos ativos)
CREATE TABLE alertas (
	id INT AUTO_INCREMENT PRIMARY KEY,
    telefone_id INT NOT NULL,
    descricao VARCHAR(255) NOT NULL, -- Ex: "pico de denuncias detectado nas ultimas 24h"
    ativo BOOLEAN DEFAULT TRUE, -- true para ativo, false para inativo
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (telefone_id) REFERENCES telefones(id) ON DELETE CASCADE
);

-- tabela de logs de consulta (guarda o historico de busca dos usuarios)
CREATE TABLE logs_consulta (
	id INT AUTO_INCREMENT PRIMARY KEY,
    numero_buscado VARCHAR(20) NOT NULL,
    data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_numero_buscado (numero_buscado) -- detecta numeros muito consultados
);
INSERT INTO tipos_golpe (nome, descricao) VALUES
('Clonagem de WhatsApp', 'O golpista assume o controle da conta do WhatsApp da vítima e pede dinheiro aos contatos.'),
('Falsa Central de Banco', 'O criminoso liga fingindo ser do setor de segurança do banco para roubar senhas ou forçar Pix.'),
('Falso Motoboy', 'A vítima é induzida a entregar o cartão bancário "com defeito" a um motoboy enviado pelo falso banco.'),
('Falso Leilão', 'Sites falsos que simulam leilões de veículos e exigem pagamentos adiantados via Pix.');

INSERT INTO telefones (numero, score_risco) VALUES
('11911111111', 15),  -- Risco Baixo (0 a 30)
('11922222222', 55),  -- Risco Médio (31 a 70)
('11933333333', 95);  -- Risco Alto (71+)

-- Vinculando denúncias para gerar inteligência e simular o histórico
INSERT INTO denuncias (telefone_id, tipo_golpe_id, descricao, data_ocorrencia) VALUES
-- Denúncia para o número de Risco Médio
(2, 1, 'Me ligaram dizendo que era do suporte do WhatsApp e pediram um código de 6 dígitos enviado por SMS.', NOW() - INTERVAL 2 DAY),

-- Denúncias para o número de Risco Alto (Simulando palavras críticas e reincidência)
(3, 2, 'URGENTE: Ligaram dizendo que minha conta foi invadida e precisava transferir o dinheiro via PIX imediatamente. Sabiam minha senha inicial.', NOW() - INTERVAL 1 HOUR),
(3, 2, 'Falsa central ligou ameaçando bloquear meu cartão de crédito se eu não confirmasse os dados bancários.', NOW() - INTERVAL 30 MINUTE),
(3, 2, 'Tentativa de golpe fingindo ser gerente do banco solicitando transferência de segurança.', NOW() - INTERVAL 10 MINUTE);

-- Gerando um alerta para o número que teve pico de denúncias recente
INSERT INTO alertas (telefone_id, descricao, ativo) VALUES
(3, 'Pico de denúncias detectado na última hora (Campanha de fraude ativa).', 1);

-- Simulando o padrão de "número excessivamente consultado"
INSERT INTO logs_consulta (numero_buscado, data_consulta) VALUES
('11911111111', NOW() - INTERVAL 5 HOUR),
('11922222222', NOW() - INTERVAL 4 HOUR),
-- O número 3 sendo buscado em massa nas últimas horas
('11933333333', NOW() - INTERVAL 50 MINUTE),
('11933333333', NOW() - INTERVAL 40 MINUTE),
('11933333333', NOW() - INTERVAL 30 MINUTE),
('11933333333', NOW() - INTERVAL 20 MINUTE),
('11933333333', NOW() - INTERVAL 10 MINUTE);
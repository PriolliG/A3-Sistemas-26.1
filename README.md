<h1 align="center">
  <img src="https://github.com/user-attachments/assets/106dbd4b-a093-4029-a50e-7990f7791b4d" width="80%">
  <br/>
</h1>

<p align="center">
  Plataforma de Consulta e Detecção de Golpes Telefônicos.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Versão-1.1.3-blue?style=for-the-badge" alt="Versão" />
  <img src="https://img.shields.io/badge/Licença-Proprietária-red?style=for-the-badge" alt="Licença" />
</p>

<p align="center">
  <a href="#funcionalidades"><strong>Como Funciona</strong></a> ·
  <a href="#tecnologias-utilizadas"><strong>Tech Stack</strong></a> ·
  <a href="#demonstração-visual"><strong>Galeria</strong></a>
</p>

<br/>

O **GolpeZero** é uma Single Page Application (SPA) desenvolvida para mapear fraudes telefônicas. A plataforma permite que qualquer pessoa consulte números suspeitos, registre denúncias e visualize indicadores de risco baseados em um sistema de reputação.

> **Aviso Legal:** Este projeto é proprietário. Todos os direitos estão reservados. Não é permitida a cópia, distribuição, modificação ou uso comercial/pessoal deste código por terceiros sem autorização prévia e expressa do autor.

---

## Funcionalidades

* **Consulta Pública:** Pesquise números de telefone e visualize instantaneamente o Score de Risco, histórico de denúncias e alertas de segurança.
* **Denúncias em Etapas:** Formulário intuitivo para registrar novas ocorrências de golpes.
* **Reputação Dinâmica:** Motor inteligente que calcula o risco com base na reincidência, frequência e presença de palavras chaves nos relatos.
* **Detecção de Padrões:** Gatilhos automatizados que identificam picos de denúncias ou números sendo excessivamente consultados para emitir alertas em tempo real.
* **Dashboard Analítico:** Painel gerencial com gráficos dinâmicos mapeando horários críticos, golpes mais comuns e ranking de números mais perigosos.
* **Portal Admin:** Ambiente seguro e isolado, protegido por chave estática, para exclusão de logs, moderação de dados e cadastro de novos tipos de golpes.

---

## Tecnologias Utilizadas

A arquitetura do projeto segue o modelo monolítico separado em camadas.

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

### Banco de Dados & Ferramentas
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)

---

## Demonstração Visual

<div align="center">
  <img src="https://github.com/user-attachments/assets/e9ba5ea5-3d17-4a30-aaf9-e69f3ad89e77" alt="Tela Principal" width="45%">
  <img src="https://github.com/user-attachments/assets/04b5a10d-2754-4d5a-96df-3726594544c6" alt="Formulário de Denúncias" width="45%">
</div>
<br>
<div align="center">
  <img src="https://github.com/user-attachments/assets/02f0d2f9-319c-4ef2-854b-6af2d12621ef" alt="Dashboard Analítico" width="45%">
  <img src="https://github.com/user-attachments/assets/d9b83c65-8094-47ea-af92-ed6237ce0455" alt="Portal Admin" width="45%">
</div>
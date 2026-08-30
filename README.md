# Aplicação de teste para deploy na AWS

Este projeto é uma aplicação mínima para testar um deploy simples na AWS, sem Docker, sem frameworks e sem dependências extras.

## O que a aplicação mostra

A página inicial exibe dados do servidor em execução, incluindo:

- hostname
- sistema operacional
- arquitetura
- uptime
- memória total e livre
- CPUs
- IPs detectados
- versão do Node.js
- PID do processo

## Como executar localmente

```bash
npm install
npm start
```

Acesse:

- http://localhost:3030/
- http://localhost:3030/api/info
- http://localhost:3030/health

## Como deployar na AWS sem Docker

### EC2

1. Crie uma instância EC2 com Ubuntu ou Amazon Linux.
2. Conecte-se via SSH.
3. Instale o Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Envie o código para a instância.
5. Dentro da pasta do projeto, execute:

```bash
npm install
PORT=3030 npm start
```

6. Para manter a aplicação rodando em background:

```bash
PORT=3030 nohup npm start > app.log 2>&1 &
```

7. Abra a porta 3030 no Security Group da EC2.

## Observação

Esta versão foi pensada para ser o mínimo funcional: Node.js puro, sem Docker, sem containers, pronta para validar um deploy simples na AWS na porta 3030.

# Aplicação de teste para deploy na AWS

Este projeto é uma aplicação mínima para validar um deploy em instâncias AWS, como EC2, Elastic Beanstalk ou containers ECS/ECR.

## O que a aplicação mostra

A página inicial exibe informações do servidor em execução, incluindo:

- hostname
- sistema operacional e arquitetura
- versão do sistema
- uptime
- memória total e livre
- quantidade de CPUs e modelo
- IPs detectados
- versão do Node.js
- PID do processo

## Como executar localmente

```bash
npm install
npm start
```

Em seguida, abra:

- http://localhost:3000
- http://localhost:3000/api/info
- http://localhost:3000/health

## Como deployar na AWS

### EC2

1. Conecte-se na instância.
2. Instale Node.js.
3. Faça upload do código para a instância.
4. Execute:

```bash
npm install
npm start
```

### Docker

```bash
docker build -t aws-server-info-app .
docker run -p 3000:3000 aws-server-info-app
```

## Observação

A aplicação foi criada para ser simples, leve e fácil de testar em qualquer ambiente AWS.

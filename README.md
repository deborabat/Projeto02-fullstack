# Minha Biblioteca — Projeto 2

Aplicação fullstack distribuída com SPA React + 3 microsserviços Node.js.

## Dependências externas

Antes de iniciar, certifique-se de que os seguintes serviços estão rodando:

- **MongoDB**: banco hospedado no MongoDB Atlas (já configurado nos arquivos `.env`)
- **Redis**: instância local na porta `6379`
  ```bash
  # macOS (Homebrew)
  brew services start redis

  # ou diretamente
  redis-server
  ```

## Instalação

Instale as dependências de cada serviço:

```bash
# auth-service
npm install --prefix auth-service

# resource-service (usa node_modules da raiz)
npm install

# notification-service
npm install --prefix notification-service

# frontend
npm install --prefix frontend
```

## Inicialização (cada serviço em um terminal separado)

```bash
# Terminal 1 — auth-service (porta 3001)
cd auth-service && npm start

# Terminal 2 — resource-service (porta 3002)
cd resource-service && node server.js

# Terminal 3 — notification-service (porta 3003)
cd notification-service && npm start

# Terminal 4 — frontend (porta 3000)
cd frontend && npm start
```

## Populando o banco com usuários de teste

```bash
cd auth-service && node seed.js
```

Usuários criados:
| Nome   | E-mail             | Senha  |
|--------|--------------------|--------|
| Debora | debora@email.com   | 123456 |
| Ana    | ana@email.com      | 123456 |

## Arquitetura

```
React (3000)
  ├── HTTP → auth-service   (3001) → MongoDB: auth-service
  ├── HTTP → resource-service (3002) → MongoDB: resource-service + Redis
  └── WS  → notification-service (3003) → Redis Pub/Sub
```

## Variáveis de ambiente

Cada serviço possui seu próprio arquivo `.env` na raiz do diretório do serviço.

| Variável          | Serviço(s)                     | Descrição                         |
|-------------------|--------------------------------|-----------------------------------|
| `PORT`            | auth, resource, notification   | Porta do serviço                  |
| `MONGODB_URI`     | auth, resource                 | URI de conexão com MongoDB Atlas  |
| `JWT_SECRET`      | auth, resource                 | Segredo para assinar/verificar JWT|
| `JWT_EXPIRES_IN`  | auth                           | Expiração do token (ex: `2h`)     |
| `AUTH_SERVICE_URL`| resource                       | URL do auth-service               |
| `REDIS_HOST`      | resource, notification         | Host do Redis                     |
| `REDIS_PORT`      | resource, notification         | Porta do Redis                    |

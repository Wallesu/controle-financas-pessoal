# API de Gerenciamento Financeiro

Uma API RESTful para gerenciamento de finanças pessoais, construída com Node.js, Express e MySQL.

## Funcionalidades

- Gerenciamento de usuários com autenticação
- Gerenciamento de contas
- Acompanhamento de transações
- Gerenciamento de categorias
- Endpoints de API seguros com autenticação JWT
- Validação de dados e tratamento de erros

## Pré-requisitos

- Node.js (v22.11.0 (LTS))
- MySQL (v8 ou superior)
- npm ou yarn

## Configuração


1. Instale as dependências:
   ```
   npm install
   ```

2. Configure o MySQL:
   - Instale o MySQL Server em sua máquina
   - Crie um novo banco de dados e configure o schema:
     ```sql
     -- Criar o banco de dados
     CREATE DATABASE IF NOT EXISTS financial_app;
     USE financial_app;

     -- Tabela de Usuários
     CREATE TABLE IF NOT EXISTS Users (
         ID INT AUTO_INCREMENT PRIMARY KEY,
         Email VARCHAR(255) NOT NULL UNIQUE,
         Password VARCHAR(255) NOT NULL,
         Name VARCHAR(100),
         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     );

     -- Tabela de Categorias
     CREATE TABLE IF NOT EXISTS Categories (
         ID INT AUTO_INCREMENT PRIMARY KEY,
         UserId INT,
         Name VARCHAR(100) NOT NULL,
         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
         FOREIGN KEY (UserId) REFERENCES Users(ID) ON DELETE CASCADE,
         CONSTRAINT unique_category_per_user UNIQUE (UserId, Name)
     );

     -- Tabela de Contas
     CREATE TABLE IF NOT EXISTS Accounts (
         ID INT AUTO_INCREMENT PRIMARY KEY,
         UserId INT NOT NULL,
         Account_Name VARCHAR(255) NOT NULL,
         Initial_Amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
         FOREIGN KEY (UserId) REFERENCES Users(ID) ON DELETE CASCADE,
         CONSTRAINT unique_account_name_per_user UNIQUE (UserId, Account_Name)
     );

     -- Tabela de Transações
     CREATE TABLE IF NOT EXISTS Transactions (
         ID INT AUTO_INCREMENT PRIMARY KEY,
         AccountID INT NOT NULL,
         CategoryID INT,
         Value DECIMAL(10, 2) NOT NULL,
         Type ENUM('income', 'expense') NOT NULL,
         Date DATE NOT NULL,
         Description TEXT,
         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
         FOREIGN KEY (AccountID) REFERENCES Accounts(ID) ON DELETE CASCADE,
         FOREIGN KEY (CategoryID) REFERENCES Categories(ID) ON DELETE SET NULL
     );
     ```

   - Crie um usuário MySQL :
     ```sql
     CREATE USER 'your_mysql_user'@'localhost' IDENTIFIED BY 'your_mysql_password';
     GRANT ALL PRIVILEGES ON financial_app.* TO 'your_mysql_user'@'localhost';
     FLUSH PRIVILEGES;
     ```
   - Anote as credenciais criadas para usar no próximo passo
   
   > **Nota**: O schema contém todas as tabelas necessárias para o funcionamento da aplicação. O arquivo completo pode ser encontrado em `src/database/schema.sql`.

3. Configure o arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   # Configuração obrigatória
   PORT=3001
   NODE_ENV=development
   
   # Configuração do banco de dados (obrigatória)
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=financial_app
   
   # Configuração opcional do pool de conexões
   DB_CONNECTION_LIMIT=10
   DB_QUEUE_LIMIT=0
   DB_WAIT_FOR_CONNECTIONS=true

   # Configuração do JWT (opcional)
   # Se não configurado, o sistema usará valores padrão internos
   JWT_SECRET=sua_chave_secreta_muito_segura
   JWT_EXPIRES_IN=90d
   ```



4. Inicialize o banco de dados (este comando irá executar o schema.sql):
   ```bash
   npm run init-db
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A API estará disponível em `http://localhost:3001`.

## Endpoints da API

### Autenticação

- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Login e obtenção do token de autenticação

### Categorias

- `POST /api/v1/categories` - Criar nova categoria
- `GET /api/v1/categories` - Listar todas as categorias
- `GET /api/v1/categories/:id` - Obter uma categoria específica
- `PATCH /api/v1/categories/:id` - Atualizar uma categoria
- `DELETE /api/v1/categories/:id` - Excluir uma categoria

### Contas

- `POST /api/v1/accounts` - Criar nova conta
- `GET /api/v1/accounts` - Listar todas as contas
- `GET /api/v1/accounts/:id` - Obter uma conta específica
- `PATCH /api/v1/accounts/:id` - Atualizar uma conta
- `DELETE /api/v1/accounts/:id` - Excluir uma conta
- `GET /api/v1/accounts/:id/balance` - Obter saldo atual de uma conta

### Transações

- `POST /api/v1/transactions` - Criar nova transação
- `GET /api/v1/transactions/account/:accountId` - Listar transações de uma conta
- `GET /api/v1/transactions/:id` - Obter uma transação específica
- `PATCH /api/v1/transactions/:id` - Atualizar uma transação
- `DELETE /api/v1/transactions/:id` - Excluir uma transação
- `GET /api/v1/transactions/period` - Listar transações por período

## Exemplos de Requisições/Respostas

### Registro de Usuário

Requisição:
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "senhasegura123",
  "name": "Usuário Teste"
}
```

Resposta:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Usuário Teste"
    }
  }
}
```

### Login de Usuário

Requisição:
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "senhasegura123"
}
```

Resposta:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Usuário Teste"
    }
  }
}
```

### Autenticação para Endpoints Protegidos

Todos os endpoints, exceto `/api/v1/auth/login` e `/api/v1/auth/register`, requerem autenticação. Inclua o token JWT no cabeçalho Authorization:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Obter Saldo da Conta

Requisição:
```http
GET /api/v1/accounts/1/balance
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```



# Frontend - Aplicação de Gerenciamento Financeiro

Interface web para o sistema de gerenciamento financeiro, construída com React, TypeScript e Material-UI.

## Pré-requisitos

- Node.js (v22.11.0 (LTS))
- npm ou yarn
- Backend da API rodando (conforme instruções acima)

## Configuração

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` na pasta `frontend` com as seguintes variáveis:
   ```env
   # URL da API (obrigatório)
   VITE_API_URL=http://localhost:3001/api/v1
   
   # Configurações opcionais
   VITE_APP_TITLE=Controle Financeiro
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:5173`.

## Tecnologias Principais

- **React**: Framework principal para construção da interface
- **TypeScript**: Para tipagem estática e melhor manutenibilidade
- **Material-UI**: Biblioteca de componentes React para interface
- **React Router**: Gerenciamento de rotas
- **Axios**: Cliente HTTP para comunicação com a API
- **Date-fns**: Manipulação e formatação de datas

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── TopBar.tsx
│   │   └── PrivateRoute.tsx
│   ├── views/         # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Accounts.tsx
│   │   ├── Transactions.tsx
│   │   └── Dashboard.tsx
│   ├── services/      # Serviços de API
│   │   └── api.ts
│   ├── hooks/         # Custom hooks
│   │   └── useAuth.ts
│   └── App.tsx        # Componente raiz
```

## Funcionalidades

- Autenticação de usuários (login/registro)
- Gerenciamento de contas
- Registro e acompanhamento de transações
- Categorização de transações
- Dashboard com gráficos e análises
- Interface responsiva e moderna

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a versão de produção
- `npm run preview`: Visualiza a versão de produção localmente
- `npm run lint`: Executa o linter
- `npm run type-check`: Verifica os tipos TypeScript

## Notas de Desenvolvimento

- A aplicação utiliza Vite como bundler
- O sistema de autenticação é baseado em JWT
- As rotas protegidas são gerenciadas pelo componente PrivateRoute
- O tema da aplicação pode ser customizado através do Material-UI
- A aplicação é totalmente responsiva e funciona em dispositivos móveis

## Integração com a API

O frontend se comunica com a API através dos endpoints documentados na seção anterior. Certifique-se de que:

1. A API está rodando e acessível
2. A URL da API está corretamente configurada no arquivo `.env`
3. O CORS está configurado corretamente no backend 

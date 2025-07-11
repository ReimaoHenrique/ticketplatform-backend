# 🎫 TicketPlatform Backend

Backend completo desenvolvido com NestJS, Prisma e SQLite para a plataforma de ingressos.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js para APIs escaláveis
- **Prisma** - ORM moderno para TypeScript
- **SQLite** - Banco de dados SQL leve
- **TypeScript** - Tipagem estática
- **Class Validator** - Validação de dados
- **JWT** - Autenticação (preparado para implementação)
- **bcryptjs** - Hash de senhas (preparado para implementação)

## 📋 Funcionalidades

### 🎪 Módulo de Eventos
- ✅ CRUD completo de eventos
- ✅ Consulta de ingressos disponíveis
- ✅ Validações de dados
- ✅ Relacionamentos com ingressos

### 🎟️ Módulo de Ingressos
- ✅ Criação de ingressos
- ✅ Consulta por CPF/Nome
- ✅ Geração de hash único
- ✅ Validação de disponibilidade
- ✅ Estatísticas de vendas

### 👨‍💼 Módulo Admin
- ✅ Autenticação por hash
- ✅ Dashboard com métricas
- ✅ Gestão de festas
- ✅ Estatísticas gerais

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <repository-url>
cd ticketplatform-backend

# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev --name init

# Popular banco com dados de exemplo
npm run db:seed

# Iniciar servidor de desenvolvimento
npm run start:dev
```

### Variáveis de Ambiente
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Admin
ADMIN_HASH="d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"

# Server
PORT=3002
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## 📚 Documentação da API

### Base URL
```
http://localhost:3002/api
```

### 🎪 Endpoints de Eventos

#### Listar Eventos
```http
GET /api/eventos
```

**Resposta:**
```json
{
  "sucesso": true,
  "data": [
    {
      "id": "evento-id",
      "nome": "Festival de Música Eletrônica 2025",
      "descricao": "Uma noite inesquecível...",
      "data": "2025-08-15T20:00:00.000Z",
      "local": "Arena Music Hall - São Paulo",
      "preco": 120.00,
      "ingressosDisponiveis": 150,
      "ingressosTotal": 500,
      "status": "ativo"
    }
  ]
}
```

#### Buscar Evento por ID
```http
GET /api/eventos/{id}
```

#### Ingressos Disponíveis
```http
GET /api/eventos/{id}/ingressos/disponiveis
```

**Resposta:**
```json
{
  "sucesso": true,
  "data": {
    "eventoId": "evento-id",
    "ingressosDisponiveis": 150,
    "ingressosTotal": 500,
    "ingressosVendidos": 350,
    "preco": 120.00,
    "linkPagamento": "https://pagamento.exemplo.com"
  }
}
```

#### Criar Evento
```http
POST /api/eventos
Content-Type: application/json

{
  "nome": "Novo Evento",
  "descricao": "Descrição do evento",
  "data": "2025-12-31T20:00:00Z",
  "local": "Local do evento",
  "preco": 100.00,
  "ingressosDisponiveis": 200,
  "ingressosTotal": 200,
  "linkPagamento": "https://pagamento.com",
  "termosUso": "Termos de uso"
}
```

### 🎟️ Endpoints de Ingressos

#### Consultar Ingresso
```http
POST /api/ingressos/consultar
Content-Type: application/json

{
  "cpf": "123.456.789-00",
  "nome": "João Silva"
}
```

**Resposta (Sucesso):**
```json
{
  "sucesso": true,
  "mensagem": "Ingresso encontrado",
  "data": {
    "id": "ingresso-id",
    "cpf": "123.456.789-00",
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "hash": "abc123...",
    "status": "ativo",
    "dataCompra": "2025-07-10T21:00:00.000Z",
    "evento": {
      "nome": "Festival de Música Eletrônica 2025",
      "data": "2025-08-15T20:00:00.000Z",
      "local": "Arena Music Hall - São Paulo"
    }
  },
  "hash": "abc123..."
}
```

**Resposta (Erro):**
```json
{
  "sucesso": false,
  "mensagem": "Nenhum ingresso encontrado com os dados informados",
  "data": null
}
```

#### Criar Ingresso
```http
POST /api/ingressos
Content-Type: application/json

{
  "eventoId": "evento-id",
  "cpf": "123.456.789-00",
  "nome": "João Silva",
  "email": "joao@exemplo.com"
}
```

#### Listar Ingressos
```http
GET /api/ingressos
```

#### Estatísticas de Ingressos
```http
GET /api/ingressos/estatisticas
```

### 👨‍💼 Endpoints de Admin

#### Login Admin
```http
POST /api/admin/login
Content-Type: application/json

{
  "hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

#### Dashboard Admin
```http
GET /api/admin/dashboard
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**Resposta:**
```json
{
  "sucesso": true,
  "data": {
    "metricas": {
      "totalEventos": 3,
      "totalIngressosVendidos": 1630,
      "lucroAtual": 264400.00,
      "lucroPotencial": 284000.00
    },
    "festas": [
      {
        "id": "festa-id",
        "nome": "Festival de Música Eletrônica 2025",
        "quantidadeTotal": 500,
        "quantidadeVendidos": 350,
        "valorUnitario": 120.00,
        "lucroAtual": 42000.00,
        "lucroPotencial": 60000.00,
        "percentualVendido": 70
      }
    ]
  }
}
```

#### Listar Festas
```http
GET /api/admin/festas
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: eventos
```sql
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT,
    "data" DATETIME NOT NULL,
    "local" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "ingressosDisponiveis" INTEGER NOT NULL,
    "ingressosTotal" INTEGER NOT NULL,
    "linkPagamento" TEXT,
    "termosUso" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
```

### Tabela: ingressos
```sql
CREATE TABLE "ingressos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventoId" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "dataCompra" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ingressos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Tabela: festas
```sql
CREATE TABLE "festas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "quantidadeTotal" INTEGER NOT NULL,
    "quantidadeVendidos" INTEGER NOT NULL DEFAULT 0,
    "valorUnitario" REAL NOT NULL,
    "data" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
```

## 🔒 Segurança

### Autenticação Admin
- Hash SHA-256 para autenticação
- Verificação de autorização em endpoints protegidos
- Headers de autorização obrigatórios

### Validações
- Validação de CPF no formato xxx.xxx.xxx-xx
- Validação de email
- Validação de dados obrigatórios
- Sanitização de entradas

### CORS
- Configurado para aceitar requisições do frontend
- Headers permitidos: Content-Type, Authorization
- Métodos permitidos: GET, POST, PUT, PATCH, DELETE, OPTIONS

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Servidor com hot reload
npm run start:debug        # Servidor com debug

# Produção
npm run build              # Build da aplicação
npm run start:prod         # Servidor de produção

# Banco de dados
npm run db:seed            # Popular banco com dados
npm run db:reset           # Reset completo do banco

# Testes
npm run test               # Testes unitários
npm run test:e2e           # Testes end-to-end
npm run test:cov           # Cobertura de testes

# Qualidade de código
npm run lint               # Verificar código
npm run format             # Formatar código
```

## 📊 Dados de Exemplo

### Admin
- **Hash:** `d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579`

### CPFs para Teste
- `123.456.789-00` - João Silva
- `987.654.321-00` - Maria Santos  
- `456.789.123-00` - Pedro Oliveira

### Eventos Criados
1. **Festival de Música Eletrônica 2025**
   - Data: 15/08/2025 às 20:00
   - Local: Arena Music Hall - São Paulo
   - Preço: R$ 120,00

2. **Show de Rock Nacional**
   - Data: 20/09/2025 às 19:00
   - Local: Estádio do Rock - Rio de Janeiro
   - Preço: R$ 80,00

3. **Festa de Ano Novo 2025**
   - Data: 31/12/2025 às 22:00
   - Local: Club Premium - Brasília
   - Preço: R$ 200,00

## 🚀 Deploy

### Preparação para Produção
1. Configurar variáveis de ambiente
2. Usar banco PostgreSQL ou MySQL
3. Configurar JWT para autenticação
4. Implementar rate limiting
5. Configurar logs estruturados
6. Implementar monitoramento

### Exemplo de Deploy (Docker)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "run", "start:prod"]
```

## 🤝 Integração com Frontend

O backend está totalmente compatível com o frontend Next.js desenvolvido. Para integrar:

1. **Atualizar URLs da API** no frontend para `http://localhost:3002/api`
2. **Configurar CORS** se necessário
3. **Implementar autenticação** JWT se desejado
4. **Testar endpoints** com os dados de exemplo

### Exemplo de Integração
```typescript
// Frontend - Consultar ingresso
const consultarIngresso = async (cpf: string, nome: string) => {
  const response = await fetch('http://localhost:3002/api/ingressos/consultar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cpf, nome }),
  });
  
  return response.json();
};
```

## 📝 Próximos Passos

- [ ] Implementar autenticação JWT completa
- [ ] Adicionar testes unitários e e2e
- [ ] Implementar rate limiting
- [ ] Adicionar logs estruturados
- [ ] Configurar CI/CD
- [ ] Documentação OpenAPI/Swagger
- [ ] Implementar cache Redis
- [ ] Adicionar webhooks para pagamentos
- [ ] Implementar notificações por email
- [ ] Adicionar métricas e monitoramento


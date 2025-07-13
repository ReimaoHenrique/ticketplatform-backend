# 📚 Documentação Completa da API - TicketPlatform

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Endpoints da API](#endpoints-da-api)
4. [Códigos de Status HTTP](#códigos-de-status-http)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Autenticação e Segurança](#autenticação-e-segurança)
7. [Exemplos de Implementação](#exemplos-de-implementação)
8. [Configuração e Instalação](#configuração-e-instalação)
9. [Testes e Debugging](#testes-e-debugging)
10. [Migração para Produção](#migração-para-produção)

---

## 🎯 Visão Geral

A API da TicketPlatform é construída usando **NestJS** com **TypeScript**, **Prisma ORM** e **SQLite**, fornecendo endpoints RESTful para gerenciamento de eventos, ingressos e administração. Todos os endpoints retornam dados em formato JSON e seguem padrões REST.

### Características Principais:

- ✅ **NestJS** - Framework Node.js para APIs escaláveis
- ✅ **Prisma** - ORM moderno para TypeScript
- ✅ **SQLite** - Banco de dados SQL leve
- ✅ **TypeScript** - Tipagem forte
- ✅ **Class Validator** - Validação automática de dados
- ✅ **Autenticação** por hash SHA-256 para admin
- ✅ **CORS** habilitado
- ✅ **Validação global** com pipes

### Base URL:

```
http://localhost:3001/api
```

---

## 🗂️ Estrutura de Dados

### 📊 Schema Prisma

#### Evento

```prisma
model Evento {
  id                    String     @id @default(cuid())
  nome                  String
  descricao             String
  imagem                String?
  data                  DateTime
  local                 String
  preco                 Float
  ingressosDisponiveis  Int
  ingressosTotal        Int
  linkPagamento         String?
  termosUso             String?
  status                String     @default("ativo")
  createdAt             DateTime   @default(now())
  updatedAt             DateTime   @updatedAt

  // Relacionamentos
  ingressos             Ingresso[]

  @@map("eventos")
}
```

#### Ingresso

```prisma
model Ingresso {
  id          String   @id @default(cuid())
  eventoId    String
  nomeEvento  String?
  cpf         String?
  nome        String
  email       String?
  hash        String   @unique
  dataCompra  DateTime @default(now())
  ativo       Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  evento      Evento   @relation(fields: [eventoId], references: [id], onDelete: Cascade)

  @@map("ingressos")
  @@index([cpf])
  @@index([hash])
  @@index([ativo])
}
```

#### Admin

```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  hash      String   @unique
  nome      String
  ativo     Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("admins")
}
```

### 📝 DTOs (Data Transfer Objects)

#### CreateEventoDto

```typescript
export class CreateEventoDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsDateString()
  data: string;

  @IsString()
  local: string;

  @IsNumber()
  @IsPositive()
  preco: number;

  @IsNumber()
  @Min(0)
  ingressosDisponiveis: number;

  @IsNumber()
  @IsPositive()
  ingressosTotal: number;

  @IsOptional()
  @IsString()
  linkPagamento?: string;

  @IsOptional()
  @IsString()
  termosUso?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
```

#### CreateIngressoDto

```typescript
export class CreateIngressoDto {
  @IsString()
  eventoId: string;

  @IsOptional()
  @IsString()
  nomeEvento?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato xxx.xxx.xxx-xx',
  })
  cpf?: string;

  @IsString()
  nome: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
```

### 📝 Estruturas de Request/Response

#### Padrão de Resposta Sucesso

```typescript
interface ApiResponse<T> {
  sucesso: true;
  data: T;
  mensagem?: string;
}
```

#### Padrão de Resposta Erro

```typescript
interface ApiError {
  sucesso: false;
  mensagem: string;
  statusCode: number;
}
```

---

## 🔌 Endpoints da API

### 🎪 Módulo de Eventos

#### 1. POST /api/eventos

**Descrição:** Cria um novo evento (requer autenticação admin).

**Headers:**

```http
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
Content-Type: application/json
```

**Request Body:**

```json
{
  "nome": "Festival de Música Eletrônica 2025",
  "descricao": "Uma noite inesquecível com os melhores DJs",
  "imagem": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
  "data": "2025-08-15T20:00:00Z",
  "local": "Arena Music Hall - São Paulo",
  "preco": 120.0,
  "ingressosDisponiveis": 150,
  "ingressosTotal": 500,
  "linkPagamento": "https://pagamento.exemplo.com/festival",
  "termosUso": "Ao comprar você concorda com nossos termos."
}
```

**Response Success (201):**

```json
{
  "sucesso": true,
  "mensagem": "Evento criado com sucesso",
  "data": {
    "id": "clx1234567890",
    "nome": "Festival de Música Eletrônica 2025",
    "descricao": "Uma noite inesquecível com os melhores DJs",
    "imagem": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
    "data": "2025-08-15T20:00:00.000Z",
    "local": "Arena Music Hall - São Paulo",
    "preco": 120,
    "ingressosDisponiveis": 150,
    "ingressosTotal": 500,
    "linkPagamento": "https://pagamento.exemplo.com/festival",
    "termosUso": "Ao comprar você concorda com nossos termos.",
    "status": "ativo",
    "createdAt": "2025-01-12T10:30:00.000Z",
    "updatedAt": "2025-01-12T10:30:00.000Z"
  }
}
```

#### 2. GET /api/eventos

**Descrição:** Lista todos os eventos.

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": [
    {
      "id": "clx1234567890",
      "nome": "Festival de Música Eletrônica 2025",
      "descricao": "Uma noite inesquecível com os melhores DJs",
      "imagem": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "data": "2025-08-15T20:00:00.000Z",
      "local": "Arena Music Hall - São Paulo",
      "preco": 120,
      "ingressosDisponiveis": 150,
      "ingressosTotal": 500,
      "linkPagamento": "https://pagamento.exemplo.com/festival",
      "termosUso": "Ao comprar você concorda com nossos termos.",
      "status": "ativo",
      "createdAt": "2025-01-12T10:30:00.000Z",
      "updatedAt": "2025-01-12T10:30:00.000Z"
    }
  ]
}
```

#### 3. GET /api/eventos/:id

**Descrição:** Busca um evento específico por ID.

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": {
    "id": "clx1234567890",
    "nome": "Festival de Música Eletrônica 2025",
    "descricao": "Uma noite inesquecível com os melhores DJs",
    "imagem": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
    "data": "2025-08-15T20:00:00.000Z",
    "local": "Arena Music Hall - São Paulo",
    "preco": 120,
    "ingressosDisponiveis": 150,
    "ingressosTotal": 500,
    "linkPagamento": "https://pagamento.exemplo.com/festival",
    "termosUso": "Ao comprar você concorda com nossos termos.",
    "status": "ativo",
    "createdAt": "2025-01-12T10:30:00.000Z",
    "updatedAt": "2025-01-12T10:30:00.000Z"
  }
}
```

#### 4. GET /api/eventos/:id/ingressos/disponiveis

**Descrição:** Retorna informações sobre ingressos disponíveis para um evento.

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": {
    "eventoId": "clx1234567890",
    "ingressosDisponiveis": 150,
    "ingressosTotal": 500,
    "preco": 120,
    "linkPagamento": "https://pagamento.exemplo.com/festival"
  }
}
```

#### 5. GET /api/eventos/:id/convidados

**Descrição:** Lista todos os convidados de um evento.

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": [
    {
      "id": "clx9876543210",
      "nome": "João Silva",
      "cpf": "123.456.789-00",
      "email": "joao@exemplo.com",
      "hash": "abc123def456",
      "dataCompra": "2025-01-10T15:30:00.000Z",
      "ativo": true
    }
  ]
}
```

#### 6. POST /api/eventos/:id/convidados/consultar

**Descrição:** Consulta um convidado específico de um evento.

**Request Body:**

```json
{
  "cpf": "123.456.789-00",
  "nome": "João Silva"
}
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "mensagem": "Convidado encontrado",
  "data": {
    "id": "clx9876543210",
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao@exemplo.com",
    "hash": "abc123def456",
    "dataCompra": "2025-01-10T15:30:00.000Z",
    "ativo": true
  },
  "hash": "abc123def456"
}
```

#### 7. PATCH /api/eventos/:id

**Descrição:** Atualiza um evento (requer autenticação admin).

**Headers:**

```http
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
Content-Type: application/json
```

**Request Body:**

```json
{
  "nome": "Festival de Música Eletrônica 2025 - Edição Especial",
  "preco": 150.0
}
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "mensagem": "Evento atualizado com sucesso",
  "data": {
    "id": "clx1234567890",
    "nome": "Festival de Música Eletrônica 2025 - Edição Especial",
    "preco": 150,
    "updatedAt": "2025-01-12T11:00:00.000Z"
  }
}
```

#### 8. DELETE /api/eventos/:id

**Descrição:** Remove um evento (requer autenticação admin).

**Headers:**

```http
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**Response Success (204):**

```json
{
  "sucesso": true,
  "mensagem": "Evento removido com sucesso"
}
```

---

### 🎟️ Módulo de Ingressos

#### 1. POST /api/ingressos

**Descrição:** Cria um novo ingresso.

**Request Body:**

```json
{
  "eventoId": "clx1234567890",
  "nomeEvento": "Festival de Música Eletrônica 2025",
  "cpf": "123.456.789-00",
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "ativo": true
}
```

**Response Success (201):**

```json
{
  "sucesso": true,
  "mensagem": "Ingresso criado com sucesso",
  "data": {
    "id": "clx9876543210",
    "eventoId": "clx1234567890",
    "nomeEvento": "Festival de Música Eletrônica 2025",
    "cpf": "123.456.789-00",
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "hash": "abc123def456",
    "dataCompra": "2025-01-12T10:30:00.000Z",
    "ativo": true,
    "createdAt": "2025-01-12T10:30:00.000Z",
    "updatedAt": "2025-01-12T10:30:00.000Z"
  }
}
```

#### 2. POST /api/ingressos/consultar

**Descrição:** Consulta ingressos por CPF ou nome. Retorna apenas informações essenciais (ativo e hash) para proteção de dados.

**Comportamento:**

- Se não informar nada no JSON → "Ingresso não encontrado"
- Se informar dados errados (CPF/nome incorretos) → "Ingresso não encontrado"
- Se informar dados corretos → Retorna `ativo` e `hash`

**Request Body:**

```json
{
  "cpf": "123.456.789-00",
  "nome": "João Silva"
}
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "mensagem": "Ingresso encontrado",
  "ativo": true,
  "hash": "abc123def456"
}
```

**Response Error (404):**

```json
{
  "sucesso": false,
  "mensagem": "Ingresso não encontrado"
}
```

#### 3. GET /api/ingressos/estatisticas

**Descrição:** Retorna estatísticas gerais dos ingressos.

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": {
    "totalIngressos": 1630,
    "ingressosAtivos": 1500,
    "ingressosInativos": 130,
    "totalVendido": 195600.0,
    "mediaPreco": 120.0,
    "eventosComIngressos": 3
  }
}
```

#### 4. GET /api/ingressos/hash/:hash

**Descrição:** Busca um ingresso por hash.

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": {
    "id": "clx9876543210",
    "eventoId": "clx1234567890",
    "nomeEvento": "Festival de Música Eletrônica 2025",
    "cpf": "123.456.789-00",
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "hash": "abc123def456",
    "dataCompra": "2025-01-12T10:30:00.000Z",
    "ativo": true,
    "createdAt": "2025-01-12T10:30:00.000Z",
    "updatedAt": "2025-01-12T10:30:00.000Z"
  }
}
```

#### 5. GET /api/ingressos/:id

**Descrição:** Busca um ingresso por ID.

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": {
    "id": "clx9876543210",
    "eventoId": "clx1234567890",
    "nomeEvento": "Festival de Música Eletrônica 2025",
    "cpf": "123.456.789-00",
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "hash": "abc123def456",
    "dataCompra": "2025-01-12T10:30:00.000Z",
    "ativo": true,
    "createdAt": "2025-01-12T10:30:00.000Z",
    "updatedAt": "2025-01-12T10:30:00.000Z"
  }
}
```

#### 6. PATCH /api/ingressos/:id/ativo

**Descrição:** Atualiza o status ativo/inativo de um ingresso.

**Request Body:**

```json
{
  "ativo": false
}
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "mensagem": "Status do ingresso atualizado com sucesso",
  "data": {
    "id": "clx9876543210",
    "ativo": false,
    "updatedAt": "2025-01-12T11:00:00.000Z"
  }
}
```

#### 7. DELETE /api/ingressos/:id

**Descrição:** Remove um ingresso.

**Response Success (204):**

```json
{
  "sucesso": true,
  "mensagem": "Ingresso removido com sucesso"
}
```

---

### 👨‍💼 Módulo de Admin

#### 1. POST /api/admin/login

**Descrição:** Autentica administrador com hash.

**Request Body:**

```json
{
  "hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "token": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

#### 2. GET /api/admin/dashboard

**Descrição:** Retorna dashboard com métricas gerais (requer autenticação).

**Headers:**

```http
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": {
    "metricas": {
      "totalEventos": 3,
      "totalIngressosVendidos": 1630,
      "lucroAtual": 264400.0,
      "lucroPotencial": 284000.0
    },
    "festas": [
      {
        "id": "clx1234567890",
        "nome": "Festival de Música Eletrônica 2025",
        "quantidadeTotal": 500,
        "quantidadeVendidos": 350,
        "valorUnitario": 120.0,
        "lucroAtual": 42000.0,
        "lucroPotencial": 60000.0,
        "percentualVendido": 70
      }
    ]
  }
}
```

#### 3. GET /api/admin/estatisticas

**Descrição:** Retorna estatísticas detalhadas (requer autenticação).

**Headers:**

```http
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "data": {
    "totalEventos": 3,
    "eventosAtivos": 2,
    "eventosFinalizados": 1,
    "totalIngressos": 1630,
    "ingressosAtivos": 1500,
    "ingressosInativos": 130,
    "receitaTotal": 264400.0,
    "receitaPotencial": 284000.0,
    "mediaPrecoIngresso": 120.0
  }
}
```

#### 4. POST /api/admin/verificar-hash

**Descrição:** Verifica se um hash é válido.

**Request Body:**

```json
{
  "hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

**Response Success (200):**

```json
{
  "sucesso": true,
  "valido": true
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado           | Uso                                  |
| ------ | --------------------- | ------------------------------------ |
| 200    | OK                    | Requisição bem-sucedida              |
| 201    | Created               | Recurso criado com sucesso           |
| 204    | No Content            | Requisição bem-sucedida sem conteúdo |
| 400    | Bad Request           | Dados inválidos ou ausentes          |
| 401    | Unauthorized          | Falha na autenticação                |
| 404    | Not Found             | Recurso não encontrado               |
| 500    | Internal Server Error | Erro interno do servidor             |

---

## ⚠️ Tratamento de Erros

### Estrutura Padrão de Erro

```typescript
interface ErrorResponse {
  sucesso: false;
  mensagem: string;
  statusCode: number;
  error?: string;
}
```

### Exemplos de Erro

#### 1. Erro de Validação (400)

```json
{
  "sucesso": false,
  "mensagem": "CPF deve estar no formato xxx.xxx.xxx-xx",
  "statusCode": 400,
  "error": "Bad Request"
}
```

#### 2. Erro de Autenticação (401)

```json
{
  "sucesso": false,
  "mensagem": "Token de autorização inválido",
  "statusCode": 401,
  "error": "Unauthorized"
}
```

#### 3. Erro de Recurso Não Encontrado (404)

```json
{
  "sucesso": false,
  "mensagem": "Evento não encontrado",
  "statusCode": 404,
  "error": "Not Found"
}
```

---

## 🔒 Autenticação e Segurança

### Autenticação Admin

A autenticação é feita através de um hash SHA-256 estático configurado nas variáveis de ambiente.

#### Hash Padrão

```
d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

#### Como Usar

```http
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

### Validações Implementadas

- ✅ Validação de CPF no formato xxx.xxx.xxx-xx
- ✅ Validação de email
- ✅ Validação de dados obrigatórios
- ✅ Sanitização automática com class-validator
- ✅ Whitelist de propriedades permitidas

### CORS Configuration

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    configService.get('CORS_ORIGIN', 'http://localhost:3000'),
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

---

## 💻 Exemplos de Implementação

### Frontend - Consumindo APIs

#### 1. Hook Personalizado para Consulta de Ingresso

```typescript
// hooks/useIngressoConsulta.ts
import { useState } from 'react';

interface ConsultarIngressoRequest {
  cpf?: string;
  nome?: string;
}

interface ConsultarIngressoResponse {
  sucesso: boolean;
  mensagem: string;
  ativo?: boolean;
  hash?: string;
}

export function useIngressoConsulta() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ConsultarIngressoResponse | null>(
    null,
  );

  const consultar = async (dados: ConsultarIngressoRequest) => {
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch(
        'http://localhost:3001/api/ingressos/consultar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dados),
        },
      );

      const data = await response.json();
      setResultado(data);

      return data;
    } catch (error) {
      console.error('Erro ao consultar ingresso:', error);
      setResultado({
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return { consultar, loading, resultado };
}
```

#### 2. Service para Admin

```typescript
// services/adminService.ts
class AdminService {
  private baseUrl = 'http://localhost:3001/api/admin';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  async login(hash: string) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash }),
    });

    const data = await response.json();

    if (data.sucesso) {
      this.setToken(data.token);
    }

    return data;
  }

  async getDashboard() {
    const token = this.getToken();

    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`${this.baseUrl}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  logout() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }
}

export const adminService = new AdminService();
```

#### 3. Componente com Tratamento de Erro

```typescript
// components/IngressoConsulta.tsx
import { useState } from 'react';
import { useIngressoConsulta } from '@/hooks/useIngressoConsulta';

export function IngressoConsulta() {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const { consultar, loading, resultado } = useIngressoConsulta();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cpf && !nome) {
      alert('Preencha pelo menos um campo');
      return;
    }

    await consultar({ cpf, nome });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Consultando...' : 'Consultar'}
      </button>

      {resultado && (
        <div className={resultado.sucesso ? 'success' : 'error'}>
          {resultado.mensagem}
          {resultado.sucesso && (
            <div>
              <h3>Status do Ingresso:</h3>
              <p>Ativo: {resultado.ativo ? 'Sim' : 'Não'}</p>
              <p>Hash: {resultado.hash}</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
```

---

## ⚙️ Configuração e Instalação

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

### Variáveis de Ambiente (.env)

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Admin
ADMIN_HASH="d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"

# Server
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### Scripts Disponíveis

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

---

## 🧪 Testes e Debugging

### 1. Testes de Endpoint com cURL

#### Consultar Ingresso

```bash
curl -X POST http://localhost:3001/api/ingressos/consultar \
  -H "Content-Type: application/json" \
  -d '{"cpf": "123.456.789-00"}'
```

#### Criar Evento (Admin)

```bash
curl -X POST http://localhost:3001/api/eventos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579" \
  -d '{
    "nome": "Novo Evento",
    "descricao": "Descrição do evento",
    "data": "2025-12-31T20:00:00Z",
    "local": "Local do evento",
    "preco": 100.00,
    "ingressosDisponiveis": 100,
    "ingressosTotal": 100
  }'
```

#### Login Admin

```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"}'
```

#### Dashboard Admin

```bash
curl -X GET http://localhost:3001/api/admin/dashboard \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
```

### 2. Dados de Exemplo

#### Admin

- **Hash:** `d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579`

#### CPFs para Teste

- `123.456.789-00` - João Silva
- `987.654.321-00` - Maria Santos
- `456.789.123-00` - Pedro Oliveira

#### Eventos Criados

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

### 3. Debugging com Logs

```typescript
// Exemplo de logging nos serviços
import { Logger } from '@nestjs/common';

@Injectable()
export class EventosService {
  private readonly logger = new Logger(EventosService.name);

  async create(createEventoDto: CreateEventoDto) {
    this.logger.log(`Criando evento: ${createEventoDto.nome}`);

    try {
      const evento = await this.prisma.evento.create({
        data: createEventoDto,
      });

      this.logger.log(`Evento criado com sucesso: ${evento.id}`);
      return evento;
    } catch (error) {
      this.logger.error(`Erro ao criar evento: ${error.message}`);
      throw error;
    }
  }
}
```

---

## 🚀 Migração para Produção

### 1. Configuração de Banco de Dados

#### PostgreSQL (Recomendado para Produção)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ticketplatform"
```

#### MySQL

```env
DATABASE_URL="mysql://user:password@localhost:3306/ticketplatform"
```

### 2. Autenticação JWT (Produção)

```typescript
// lib/auth-prod.ts
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
    });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
```

### 3. Rate Limiting (Implementação Futura)

```typescript
// lib/middleware/rateLimit.ts
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 4. Monitoramento e Logs

```typescript
// lib/monitoring.ts
import { Logger } from '@nestjs/common';

export class Monitoring {
  static async logApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
  ) {
    const logData = {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      statusCode,
      responseTime,
      userId,
      environment: process.env.NODE_ENV,
    };

    Logger.log(`[API_CALL] ${JSON.stringify(logData)}`);
  }
}
```

### 5. Deploy com Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/ticketplatform
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=ticketplatform
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📈 Performance e Otimização

### 1. Cache Redis (Implementação Futura)

```typescript
// lib/cache.ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class AppModule {}
```

### 2. Paginação

```typescript
// lib/pagination.ts
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

---

## 🔧 Ferramentas de Desenvolvimento

### 1. Prisma Studio

```bash
npx prisma studio
```

Acesse http://localhost:5555 para visualizar e editar dados do banco.

### 2. Swagger/OpenAPI (Implementação Futura)

```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('TicketPlatform API')
  .setDescription('API para gerenciamento de eventos e ingressos')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

---

## 📚 Recursos Adicionais

### Documentação de Referência

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Class Validator](https://github.com/typestack/class-validator)

### Ferramentas Recomendadas

- **Postman** - Testes de API
- **Insomnia** - Cliente REST
- **Prisma Studio** - Interface do banco
- **Redis Commander** - Interface Redis
- **Sentry** - Monitoramento de erros
- **Vercel Analytics** - Métricas de performance

---

**📝 Última atualização:** Janeiro 2025  
**👨‍💻 Versão da API:** 1.0.0  
**🔧 Compatibilidade:** NestJS 11+, TypeScript 5+, Prisma 6+

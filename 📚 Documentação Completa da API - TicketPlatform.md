# 📚 Documentação Completa da API - TicketPlatform

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Endpoints da API](#endpoints-da-api)
4. [Códigos de Status HTTP](#códigos-de-status-http)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Exemplos de Implementação](#exemplos-de-implementação)
7. [Validações e Sanitização](#validações-e-sanitização)
8. [Segurança](#segurança)
9. [Testes e Debugging](#testes-e-debugging)
10. [Migração para Produção](#migração-para-produção)

---

## 🎯 Visão Geral

A API da TicketPlatform é construída usando **Next.js 15 App Router** com **TypeScript**, fornecendo endpoints RESTful para gerenciamento de eventos, ingressos e administração. Todos os endpoints retornam dados em formato JSON e seguem padrões REST.

### Características Principais:
- ✅ **TypeScript** para tipagem forte
- ✅ **Validação** automática de dados
- ✅ **Sanitização** de entradas
- ✅ **Tratamento de erros** padronizado
- ✅ **Autenticação** por hash SHA-256
- ✅ **Mock data** para desenvolvimento
- ✅ **CORS** habilitado

### Base URL:
```
http://localhost:3000/api
```

---

## 🗂️ Estrutura de Dados

### 📊 Interfaces TypeScript

#### Evento
```typescript
interface Evento {
  id: string;                    // Identificador único
  nome: string;                  // Nome do evento
  descricao: string;             // Descrição detalhada
  imagem: string;                // URL da imagem
  data: string;                  // Data/hora ISO 8601
  local: string;                 // Local do evento
  preco: number;                 // Preço em reais
  ingressosDisponiveis: number;  // Quantidade disponível
  ingressosTotal: number;        // Quantidade total
  linkPagamento: string;         // URL de pagamento
  termosUso: string;             // Termos e condições
}
```

#### Ingresso
```typescript
interface Ingresso {
  id: string;                    // Identificador único
  eventoId: string;              // ID do evento
  cpf: string;                   // CPF do comprador
  nome: string;                  // Nome completo
  email: string;                 // Email de contato
  hash: string;                  // Hash único do ingresso
  dataCompra: string;            // Data/hora da compra ISO 8601
  status: 'ativo' | 'usado' | 'cancelado'; // Status atual
}
```

#### Festa (Admin)
```typescript
interface Festa {
  id: string;                    // Identificador único
  nome: string;                  // Nome da festa
  quantidadeTotal: number;       // Total de ingressos
  quantidadeVendidos: number;    // Ingressos vendidos
  valorUnitario: number;         // Valor por ingresso
  lucroTotal: number;            // Lucro se vender todos
  lucroAtual: number;            // Lucro atual
  data: string;                  // Data do evento
  status: 'ativa' | 'finalizada' | 'cancelada'; // Status
}
```

### 📝 Estruturas de Request/Response

#### Padrão de Resposta Sucesso
```typescript
interface ApiResponse<T> {
  sucesso: true;
  data: T;
  mensagem?: string;
  timestamp?: string;
}
```

#### Padrão de Resposta Erro
```typescript
interface ApiError {
  sucesso: false;
  mensagem: string;
  codigo?: string;
  detalhes?: any;
  timestamp?: string;
}
```

---

## 🔌 Endpoints da API

### 1. 📊 GET /api/ingressos/disponiveis

**Descrição:** Retorna informações sobre ingressos disponíveis para o evento principal.

#### Request
```http
GET /api/ingressos/disponiveis
Content-Type: application/json
```

#### Response Success (200)
```json
{
  "sucesso": true,
  "data": {
    "eventoId": "1",
    "ingressosDisponiveis": 150,
    "ingressosTotal": 500,
    "preco": 120.00,
    "linkPagamento": "https://pagamento.exemplo.com/evento/1"
  }
}
```

#### Response Error (500)
```json
{
  "sucesso": false,
  "mensagem": "Erro interno do servidor"
}
```

#### Implementação
```typescript
// src/app/api/ingressos/disponiveis/route.ts
import { NextResponse } from 'next/server';
import { eventoMock } from '@/lib/mock-data';

export async function GET() {
  try {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      sucesso: true,
      data: {
        eventoId: eventoMock.id,
        ingressosDisponiveis: eventoMock.ingressosDisponiveis,
        ingressosTotal: eventoMock.ingressosTotal,
        preco: eventoMock.preco,
        linkPagamento: eventoMock.linkPagamento
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ingressos disponíveis:', error);
    return NextResponse.json(
      { 
        sucesso: false, 
        mensagem: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
```

---

### 2. 🔍 POST /api/ingresso/consultar

**Descrição:** Consulta um ingresso específico por CPF ou nome.

#### Request
```http
POST /api/ingresso/consultar
Content-Type: application/json

{
  "cpf": "123.456.789-00",
  "nome": "João Silva"
}
```

#### Parâmetros
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| cpf | string | Não* | CPF formatado (xxx.xxx.xxx-xx) |
| nome | string | Não* | Nome completo ou parcial |

*Pelo menos um campo deve ser fornecido

#### Response Success (200)
```json
{
  "sucesso": true,
  "mensagem": "Ingresso ativo. Hash: abc123def456",
  "data": {
    "ingresso": {
      "id": "ing_001",
      "eventoId": "1",
      "cpf": "123.456.789-00",
      "nome": "João Silva",
      "email": "joao@email.com",
      "hash": "abc123def456",
      "dataCompra": "2025-07-01T10:30:00Z",
      "status": "ativo"
    },
    "hash": "abc123def456"
  }
}
```

#### Response Error (404)
```json
{
  "sucesso": false,
  "mensagem": "Nenhum ingresso encontrado"
}
```

#### Response Error (400)
```json
{
  "sucesso": false,
  "mensagem": "Por favor, forneça CPF ou nome para consulta."
}
```

#### Implementação
```typescript
// src/app/api/ingresso/consultar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ingressosMock } from '@/lib/mock-data';
import { MESSAGES } from '@/lib/constants';
import { validarCPF, sanitizarEntrada } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { cpf, nome } = body;

    // Sanitização
    if (cpf) cpf = sanitizarEntrada(cpf);
    if (nome) nome = sanitizarEntrada(nome);

    // Validação básica
    if (!cpf && !nome) {
      return NextResponse.json(
        { 
          sucesso: false, 
          mensagem: 'Por favor, forneça CPF ou nome para consulta.' 
        },
        { status: 400 }
      );
    }

    // Validação de CPF se fornecido
    if (cpf && !validarCPF(cpf)) {
      return NextResponse.json(
        { 
          sucesso: false, 
          mensagem: 'CPF inválido.' 
        },
        { status: 400 }
      );
    }

    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Busca ingresso
    let ingressoEncontrado;

    if (cpf) {
      ingressoEncontrado = ingressosMock.find(ingresso => 
        ingresso.cpf === cpf
      );
    } else if (nome) {
      ingressoEncontrado = ingressosMock.find(ingresso => 
        ingresso.nome.toLowerCase().includes(nome.toLowerCase())
      );
    }

    if (ingressoEncontrado) {
      return NextResponse.json({
        sucesso: true,
        mensagem: `${MESSAGES.INGRESSO_ENCONTRADO} ${ingressoEncontrado.hash}`,
        data: {
          ingresso: ingressoEncontrado,
          hash: ingressoEncontrado.hash
        }
      });
    } else {
      return NextResponse.json({
        sucesso: false,
        mensagem: MESSAGES.INGRESSO_NAO_ENCONTRADO
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Erro ao consultar ingresso:', error);
    return NextResponse.json(
      { 
        sucesso: false, 
        mensagem: MESSAGES.ERRO_SERVIDOR 
      },
      { status: 500 }
    );
  }
}
```

---

### 3. 👨‍💼 GET /api/admin/festas

**Descrição:** Lista todas as festas cadastradas (requer autenticação).

#### Request
```http
GET /api/admin/festas
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
Content-Type: application/json
```

#### Headers
| Header | Valor | Obrigatório | Descrição |
|--------|-------|-------------|-----------|
| Authorization | Bearer {hash} | Sim | Hash de autenticação admin |

#### Response Success (200)
```json
{
  "sucesso": true,
  "data": [
    {
      "id": "1",
      "nome": "Festival de Música Eletrônica 2025",
      "quantidadeTotal": 500,
      "quantidadeVendidos": 350,
      "valorUnitario": 120.00,
      "lucroTotal": 60000.00,
      "lucroAtual": 42000.00,
      "data": "2025-08-15",
      "status": "ativa"
    }
  ],
  "resumo": {
    "totalFestas": 3,
    "festasAtivas": 2,
    "festasFinalizadas": 1,
    "lucroTotal": 264400.00
  }
}
```

#### Response Error (401)
```json
{
  "sucesso": false,
  "mensagem": "Acesso negado. Token inválido."
}
```

---

### 4. 🔐 POST /api/admin/festas

**Descrição:** Autentica administrador com hash.

#### Request
```http
POST /api/admin/festas
Content-Type: application/json

{
  "hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

#### Response Success (200)
```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso.",
  "token": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

#### Response Error (401)
```json
{
  "sucesso": false,
  "mensagem": "Hash de acesso inválido."
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Requisição bem-sucedida |
| 400 | Bad Request | Dados inválidos ou ausentes |
| 401 | Unauthorized | Falha na autenticação |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

---

## ⚠️ Tratamento de Erros

### Estrutura Padrão de Erro
```typescript
interface ErrorResponse {
  sucesso: false;
  mensagem: string;
  codigo?: string;
  detalhes?: {
    campo?: string;
    valorRecebido?: any;
    valorEsperado?: string;
  };
  timestamp?: string;
}
```

### Tipos de Erro

#### 1. Erro de Validação
```json
{
  "sucesso": false,
  "mensagem": "CPF inválido.",
  "codigo": "VALIDATION_ERROR",
  "detalhes": {
    "campo": "cpf",
    "valorRecebido": "123.456.789-99",
    "valorEsperado": "CPF válido no formato xxx.xxx.xxx-xx"
  }
}
```

#### 2. Erro de Autenticação
```json
{
  "sucesso": false,
  "mensagem": "Token de acesso inválido ou expirado.",
  "codigo": "AUTH_ERROR"
}
```

#### 3. Erro de Servidor
```json
{
  "sucesso": false,
  "mensagem": "Erro interno do servidor. Tente novamente.",
  "codigo": "SERVER_ERROR"
}
```

### Implementação de Tratamento
```typescript
// Middleware de tratamento de erros
export function handleApiError(error: any, context: string) {
  console.error(`[${context}] Erro:`, error);
  
  if (error.name === 'ValidationError') {
    return NextResponse.json({
      sucesso: false,
      mensagem: error.message,
      codigo: 'VALIDATION_ERROR',
      detalhes: error.details
    }, { status: 400 });
  }
  
  if (error.name === 'AuthError') {
    return NextResponse.json({
      sucesso: false,
      mensagem: 'Acesso negado.',
      codigo: 'AUTH_ERROR'
    }, { status: 401 });
  }
  
  return NextResponse.json({
    sucesso: false,
    mensagem: 'Erro interno do servidor.',
    codigo: 'SERVER_ERROR'
  }, { status: 500 });
}
```

---

## 💻 Exemplos de Implementação

### Frontend - Consumindo APIs

#### 1. Hook Personalizado para Consulta de Ingresso
```typescript
// hooks/useIngressoConsulta.ts
import { useState } from 'react';
import { VerificarIngressoRequest, VerificarIngressoResponse } from '@/types';

export function useIngressoConsulta() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<VerificarIngressoResponse | null>(null);

  const consultar = async (dados: VerificarIngressoRequest) => {
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch('/api/ingresso/consultar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();
      setResultado(data);
      
      return data;
    } catch (error) {
      console.error('Erro ao consultar ingresso:', error);
      setResultado({
        sucesso: false,
        mensagem: 'Erro de conexão. Tente novamente.'
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
  private baseUrl = '/api/admin';
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
    const response = await fetch(`${this.baseUrl}/festas`, {
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

  async getFestas() {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`${this.baseUrl}/festas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
          {resultado.sucesso && resultado.data && (
            <div>
              <h3>Detalhes do Ingresso:</h3>
              <p>Nome: {resultado.data.ingresso.nome}</p>
              <p>CPF: {resultado.data.ingresso.cpf}</p>
              <p>Hash: {resultado.data.hash}</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
```

---

## ✅ Validações e Sanitização

### Funções de Validação
```typescript
// lib/validations.ts

// Validação de CPF
export function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
  
  return true;
}

// Sanitização de entrada
export function sanitizarEntrada(entrada: string): string {
  return entrada.trim().replace(/[<>]/g, '');
}

// Validação de hash
export function validarHash(hash: string): boolean {
  const regex = /^[a-f0-9]{64}$/i;
  return regex.test(hash);
}

// Validação de email
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### Middleware de Validação
```typescript
// lib/middleware/validation.ts
import { NextRequest } from 'next/server';

export async function validateRequest(
  request: NextRequest,
  schema: any
) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: 'Dados inválidos',
      details: error 
    };
  }
}

// Exemplo de uso com Zod
import { z } from 'zod';

const consultaIngressoSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
}).refine(data => data.cpf || data.nome, {
  message: "CPF ou nome deve ser fornecido"
});
```

---

## 🔒 Segurança

### 1. Autenticação por Hash
```typescript
// lib/auth.ts
import { ADMIN_HASH } from '@/lib/constants';

export function verificarAutenticacao(token: string): boolean {
  return token === ADMIN_HASH;
}

export function extrairToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '');
}
```

### 2. Rate Limiting (Implementação Futura)
```typescript
// lib/middleware/rateLimit.ts
const rateLimitMap = new Map();

export function rateLimit(ip: string, limit: number = 10, window: number = 60000) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove requisições antigas
  const validRequests = userRequests.filter(
    (timestamp: number) => now - timestamp < window
  );
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  
  return true;
}
```

### 3. CORS Configuration
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

---

## 🧪 Testes e Debugging

### 1. Testes de Endpoint
```typescript
// __tests__/api/ingresso.test.ts
import { POST } from '@/app/api/ingresso/consultar/route';
import { NextRequest } from 'next/server';

describe('/api/ingresso/consultar', () => {
  it('deve retornar ingresso válido para CPF correto', async () => {
    const request = new NextRequest('http://localhost:3000/api/ingresso/consultar', {
      method: 'POST',
      body: JSON.stringify({ cpf: '123.456.789-00' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sucesso).toBe(true);
    expect(data.data.ingresso.cpf).toBe('123.456.789-00');
  });

  it('deve retornar erro para CPF inválido', async () => {
    const request = new NextRequest('http://localhost:3000/api/ingresso/consultar', {
      method: 'POST',
      body: JSON.stringify({ cpf: '000.000.000-00' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.sucesso).toBe(false);
  });
});
```

### 2. Debugging com Logs
```typescript
// lib/logger.ts
export class Logger {
  static info(message: string, data?: any) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
    }
  }
}

// Uso nos endpoints
import { Logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  Logger.info('Iniciando consulta de ingresso');
  
  try {
    const body = await request.json();
    Logger.debug('Dados recebidos:', body);
    
    // ... lógica do endpoint
    
    Logger.info('Consulta realizada com sucesso');
    return response;
  } catch (error) {
    Logger.error('Erro na consulta de ingresso:', error);
    throw error;
  }
}
```

### 3. Ferramentas de Teste

#### Postman Collection
```json
{
  "info": {
    "name": "TicketPlatform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Consultar Ingresso",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"cpf\": \"123.456.789-00\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/ingresso/consultar",
          "host": ["{{baseUrl}}"],
          "path": ["api", "ingresso", "consultar"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

#### cURL Examples
```bash
# Consultar ingresso por CPF
curl -X POST http://localhost:3000/api/ingresso/consultar \
  -H "Content-Type: application/json" \
  -d '{"cpf": "123.456.789-00"}'

# Obter ingressos disponíveis
curl -X GET http://localhost:3000/api/ingressos/disponiveis

# Login admin
curl -X POST http://localhost:3000/api/admin/festas \
  -H "Content-Type: application/json" \
  -d '{"hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"}'

# Listar festas (admin)
curl -X GET http://localhost:3000/api/admin/festas \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
```

---

## 🚀 Migração para Produção

### 1. Substituindo Mock Data

#### Configuração de Banco de Dados
```typescript
// lib/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
```

#### Repository Pattern
```typescript
// repositories/ingressoRepository.ts
import { query } from '@/lib/database';
import { Ingresso } from '@/types';

export class IngressoRepository {
  async findByCpf(cpf: string): Promise<Ingresso | null> {
    const result = await query(
      'SELECT * FROM ingressos WHERE cpf = $1 AND status = $2',
      [cpf, 'ativo']
    );
    
    return result.rows[0] || null;
  }

  async findByNome(nome: string): Promise<Ingresso[]> {
    const result = await query(
      'SELECT * FROM ingressos WHERE nome ILIKE $1 AND status = $2',
      [`%${nome}%`, 'ativo']
    );
    
    return result.rows;
  }

  async create(ingresso: Omit<Ingresso, 'id'>): Promise<Ingresso> {
    const result = await query(
      `INSERT INTO ingressos (evento_id, cpf, nome, email, hash, data_compra, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        ingresso.eventoId,
        ingresso.cpf,
        ingresso.nome,
        ingresso.email,
        ingresso.hash,
        ingresso.dataCompra,
        ingresso.status
      ]
    );
    
    return result.rows[0];
  }
}
```

### 2. Variáveis de Ambiente
```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/ticketplatform
ADMIN_HASH=d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
JWT_SECRET=your-super-secret-jwt-key
PAYMENT_GATEWAY_URL=https://api.payment-provider.com
PAYMENT_GATEWAY_KEY=your-payment-key
EMAIL_SERVICE_KEY=your-email-service-key
```

### 3. Schema de Banco de Dados
```sql
-- migrations/001_create_tables.sql

CREATE TABLE eventos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  imagem VARCHAR(500),
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  local VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  ingressos_disponiveis INTEGER NOT NULL,
  ingressos_total INTEGER NOT NULL,
  link_pagamento VARCHAR(500),
  termos_uso TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ingressos (
  id SERIAL PRIMARY KEY,
  evento_id INTEGER REFERENCES eventos(id),
  cpf VARCHAR(14) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  hash VARCHAR(64) UNIQUE NOT NULL,
  data_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ingressos_cpf ON ingressos(cpf);
CREATE INDEX idx_ingressos_hash ON ingressos(hash);
CREATE INDEX idx_ingressos_status ON ingressos(status);
```

### 4. Autenticação JWT (Produção)
```typescript
// lib/auth-prod.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '');
}
```

### 5. Monitoramento e Logs
```typescript
// lib/monitoring.ts
export class Monitoring {
  static async logApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string
  ) {
    const logData = {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      statusCode,
      responseTime,
      userId,
      environment: process.env.NODE_ENV
    };

    // Enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      await fetch(process.env.MONITORING_WEBHOOK!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
    }

    console.log('[API_CALL]', logData);
  }
}
```

---

## 📈 Performance e Otimização

### 1. Cache Redis
```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export class Cache {
  static async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  static async del(key: string): Promise<void> {
    await redis.del(key);
  }
}

// Uso nos endpoints
export async function GET() {
  const cacheKey = 'ingressos:disponiveis';
  let data = await Cache.get(cacheKey);

  if (!data) {
    data = await fetchFromDatabase();
    await Cache.set(cacheKey, data, 300); // 5 minutos
  }

  return NextResponse.json({ sucesso: true, data });
}
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

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / params.limit);
  
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1
    }
  };
}
```

---

## 🔧 Ferramentas de Desenvolvimento

### 1. Scripts Úteis
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js",
    "api:test": "newman run postman/collection.json"
  }
}
```

### 2. Configuração do Jest
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

---

## 📚 Recursos Adicionais

### Documentação de Referência
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Ferramentas Recomendadas
- **Postman** - Testes de API
- **Insomnia** - Cliente REST
- **pgAdmin** - Administração PostgreSQL
- **Redis Commander** - Interface Redis
- **Sentry** - Monitoramento de erros
- **Vercel Analytics** - Métricas de performance

---

**📝 Última atualização:** Janeiro 2025  
**👨‍💻 Versão da API:** 1.0.0  
**🔧 Compatibilidade:** Next.js 15+, TypeScript 5+


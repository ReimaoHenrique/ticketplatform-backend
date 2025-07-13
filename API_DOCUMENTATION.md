# 📚 Documentação Completa da API - TicketPlatform

## 🚀 Informações Gerais

- **Base URL:** `http://localhost:3002/api`
- **Porta:** 3002
- **Autenticação:** Hash-based (Bearer Token)
- **Banco de Dados:** SQLite com Prisma

---

## 🔐 Autenticação

### Hash Admin Conhecido

```
d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**⚠️ VULNERABILIDADE:** Hash hardcoded no código!

---

## 📋 Endpoints Públicos (Sem Autenticação)

### 1. Health Check

```
GET /
GET /api
```

**Descrição:** Verificação básica de status da API

---

### 2. Listar Todos os Eventos

```
GET /api/eventos
```

**Descrição:** Retorna todos os eventos cadastrados

**Resposta:**

```json
{
  "sucesso": true,
  "data": [
    {
      "id": 1,
      "nome": "Show de Rock",
      "descricao": "As melhores bandas de rock nacional",
      "imagem": "https://exemplo.com/imagem.jpg",
      "data": "2025-08-15T20:00:00.000Z",
      "local": "Estádio do Rock",
      "preco": 80.0,
      "ingressosDisponiveis": 50,
      "ingressosTotal": 100,
      "linkPagamento": "https://pagamento.com",
      "termosUso": "Proibido menores de 16 anos",
      "status": "ativo",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "_count": {
        "convidados": 5
      }
    }
  ]
}
```

**🎯 VULNERABILIDADES:**

- Information disclosure
- Enumeration de eventos

---

### 3. Buscar Evento por ID

```
GET /api/eventos/{id}
```

**Parâmetros:** `id` (número)

**Exemplo:**

```bash
curl -X GET http://localhost:3002/api/eventos/1
```

**Resposta:**

```json
{
  "sucesso": true,
  "data": {
    "id": 1,
    "nome": "Show de Rock",
    "descricao": "As melhores bandas de rock nacional",
    "imagem": "https://exemplo.com/imagem.jpg",
    "data": "2025-08-15T20:00:00.000Z",
    "local": "Estádio do Rock",
    "preco": 80.0,
    "ingressosDisponiveis": 50,
    "ingressosTotal": 100,
    "linkPagamento": "https://pagamento.com",
    "termosUso": "Proibido menores de 16 anos",
    "status": "ativo",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "convidados": [],
    "_count": {
      "convidados": 5
    }
  }
}
```

**🎯 VULNERABILIDADES:**

- IDOR (Insecure Direct Object Reference)
- Enumeration de IDs
- SQL Injection (improvável com Prisma)

---

### 4. Verificar Ingressos Disponíveis

```
GET /api/eventos/{id}/ingressos/disponiveis
```

**Parâmetros:** `id` (número)

**Exemplo:**

```bash
curl -X GET http://localhost:3002/api/eventos/1/ingressos/disponiveis
```

**Resposta:**

```json
{
  "sucesso": true,
  "data": {
    "eventoId": 1,
    "ingressosDisponiveis": 45,
    "ingressosTotal": 100,
    "ingressosVendidos": 55,
    "preco": 80.0,
    "linkPagamento": "https://pagamento.com"
  }
}
```

**🎯 VULNERABILIDADES:**

- IDOR
- Information disclosure sobre capacidade

---

### 5. Listar Convidados de um Evento

```
GET /api/eventos/{id}/convidados
```

**Parâmetros:** `id` (número)

**Exemplo:**

```bash
curl -X GET http://localhost:3002/api/eventos/1/convidados
```

**Resposta:**

```json
{
  "sucesso": true,
  "data": [
    {
      "id": "abc123def456",
      "cpf": "123.456.789-00",
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "telefone": "(11) 99999-9999",
      "status": "confirmado",
      "observacoes": "Convidado VIP",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**🎯 VULNERABILIDADES:**

- IDOR
- Information disclosure de dados pessoais
- Enumeration de convidados

---

### 6. Consultar Convidado Específico

```
POST /api/eventos/{id}/convidados/consultar
```

**Parâmetros:** `id` (número)

**Body:**

```json
{
  "cpf": "123.456.789-00",
  "nome": "João Silva"
}
```

**Exemplo:**

```bash
curl -X POST http://localhost:3002/api/eventos/1/convidados/consultar \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "123.456.789-00",
    "nome": "João Silva"
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Convidado encontrado",
  "data": {
    "id": "abc123def456",
    "cpf": "123.456.789-00",
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "hash": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123",
    "dataCompra": "2024-01-15T10:30:00.000Z",
    "ativo": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "evento": {
      "nome": "Show de Rock",
      "data": "2025-08-15T20:00:00.000Z",
      "local": "Estádio do Rock"
    }
  }
}
```

**🎯 VULNERABILIDADES:**

- IDOR
- Information disclosure
- Enumeration de CPFs
- SQL Injection

---

### 7. Criar Convidado

```
POST /api/eventos/convidados
```

**Body:**

```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "eventoId": 1,
  "email": "joao@exemplo.com"
}
```

**Exemplo:**

```bash
curl -X POST http://localhost:3002/api/eventos/convidados \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "eventoId": 1,
    "email": "joao@exemplo.com"
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Convidado criado com sucesso",
  "data": {
    "id": "abc123def456",
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "telefone": null,
    "cpf": "123.456.789-00",
    "eventoId": 1,
    "status": "pendente",
    "observacoes": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**🎯 VULNERABILIDADES:**

- Input validation bypass
- XSS via campos de texto
- Enumeration de eventos

---

### 8. Consultar Status do Convidado

```
POST /api/eventos/convidados/status
```

**Body (CPF ou Email):**

**Por CPF:**

```json
{
  "cpf": "123.456.789-00"
}
```

**Por Email:**

```json
{
  "email": "joao@exemplo.com"
}
```

**Exemplo:**

```bash
curl -X POST http://localhost:3002/api/eventos/convidados/status \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com"
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Status consultado com sucesso",
  "data": {
    "status": "pendente",
    "evento": {
      "nome": "Show de Rock",
      "data": "2025-08-15T20:00:00.000Z",
      "local": "Estádio do Rock"
    }
  }
}
```

**🎯 VULNERABILIDADES:**

- Information disclosure
- Enumeration de CPFs/emails
- Input validation bypass

---

## 🔐 Endpoints Admin (Com Autenticação)

### 9. Login Admin

```
POST /api/admin/login
```

**Body:**

```json
{
  "hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

**Exemplo:**

```bash
curl -X POST http://localhost:3002/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "admin": true
}
```

**🎯 VULNERABILIDADES:**

- Weak authentication
- Hash hardcoded
- Brute force
- No rate limiting

---

### 10. Dashboard Admin

```
GET /api/admin/dashboard
```

**Headers:**

```
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**Exemplo:**

```bash
curl -X GET http://localhost:3002/api/admin/dashboard \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
```

**Resposta:**

```json
{
  "sucesso": true,
  "data": {
    "metricas": {
      "totalEventos": 3,
      "totalConvidadosConfirmados": 15,
      "lucroAtual": 1200.0,
      "lucroPotencial": 2400.0
    },
    "eventos": [
      {
        "id": 1,
        "nome": "Show de Rock",
        "descricao": "As melhores bandas de rock nacional",
        "imagem": "https://exemplo.com/imagem.jpg",
        "data": "2025-08-15T20:00:00.000Z",
        "local": "Estádio do Rock",
        "preco": 80.0,
        "ingressosDisponiveis": 50,
        "ingressosTotal": 100,
        "linkPagamento": "https://pagamento.com",
        "termosUso": "Proibido menores de 16 anos",
        "status": "ativo",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "vendidos": 50,
        "lucroAtual": 4000.0,
        "lucroPotencial": 8000.0,
        "percentualVendido": 50
      }
    ]
  }
}
```

**🎯 VULNERABILIDADES:**

- Weak token validation
- Information disclosure de métricas sensíveis
- No session management

---

### 11. Estatísticas Gerais

```
GET /api/admin/estatisticas
```

**Headers:**

```
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**Exemplo:**

```bash
curl -X GET http://localhost:3002/api/admin/estatisticas \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
```

**Resposta:**

```json
{
  "sucesso": true,
  "data": {
    "eventos": {
      "total": 3,
      "ativos": 2
    },
    "convidados": {
      "total": 25,
      "confirmados": 15
    },
    "receita": {
      "atual": 1200.0,
      "potencial": 2400.0,
      "percentual": 50
    }
  }
}
```

**🎯 VULNERABILIDADES:**

- Weak token validation
- Information disclosure

---

### 12. Verificar Hash

```
POST /api/admin/verificar-hash
```

**Body:**

```json
{
  "hash": "teste"
}
```

**Exemplo:**

```bash
curl -X POST http://localhost:3002/api/admin/verificar-hash \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "teste"
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "valido": false
}
```

**🎯 VULNERABILIDADES:**

- Enumeration de hashes válidos
- Information disclosure
- No rate limiting

---

### 13. Criar Evento (Admin)

```
POST /api/eventos
```

**Headers:**

```
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
Content-Type: application/json
```

**Body:**

```json
{
  "nome": "Evento Teste",
  "descricao": "Descrição do evento",
  "imagem": "https://exemplo.com/imagem.jpg",
  "data": "2025-12-31T20:00:00Z",
  "local": "Local do evento",
  "preco": 100.0,
  "ingressosDisponiveis": 50,
  "ingressosTotal": 100,
  "linkPagamento": "https://pagamento.com",
  "termosUso": "Termos de uso"
}
```

**Exemplo:**

```bash
curl -X POST http://localhost:3002/api/eventos \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Evento Teste",
    "descricao": "Descrição do evento",
    "data": "2025-12-31T20:00:00Z",
    "local": "Local do evento",
    "preco": 100.0,
    "ingressosDisponiveis": 50,
    "ingressosTotal": 100
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Evento criado com sucesso",
  "data": {
    "id": 4,
    "nome": "Evento Teste",
    "descricao": "Descrição do evento",
    "imagem": null,
    "data": "2025-12-31T20:00:00.000Z",
    "local": "Local do evento",
    "preco": 100,
    "ingressosDisponiveis": 50,
    "ingressosTotal": 100,
    "linkPagamento": null,
    "termosUso": null,
    "status": "ativo",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**🎯 VULNERABILIDADES:**

- XSS via campos de texto
- SSRF via linkPagamento
- Input validation bypass

---

### 14. Atualizar Evento (Admin)

```
PATCH /api/eventos/{id}
```

**Headers:**

```
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
Content-Type: application/json
```

**Parâmetros:** `id` (número)

**Body:** Mesmo formato do criar, mas campos opcionais

**Exemplo:**

```bash
curl -X PATCH http://localhost:3002/api/eventos/1 \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Show de Rock Atualizado",
    "preco": 90.0
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Evento atualizado com sucesso",
  "data": {
    "id": 1,
    "nome": "Show de Rock Atualizado",
    "descricao": "As melhores bandas de rock nacional",
    "imagem": "https://exemplo.com/imagem.jpg",
    "data": "2025-08-15T20:00:00.000Z",
    "local": "Estádio do Rock",
    "preco": 90.0,
    "ingressosDisponiveis": 50,
    "ingressosTotal": 100,
    "linkPagamento": "https://pagamento.com",
    "termosUso": "Proibido menores de 16 anos",
    "status": "ativo",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**🎯 VULNERABILIDADES:**

- IDOR
- XSS
- SSRF
- Input validation bypass

---

### 15. Deletar Evento (Admin)

```
DELETE /api/eventos/{id}
```

**Headers:**

```
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
```

**Parâmetros:** `id` (número)

**Exemplo:**

```bash
curl -X DELETE http://localhost:3002/api/eventos/1 \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Evento removido com sucesso"
}
```

**🎯 VULNERABILIDADES:**

- IDOR
- Mass assignment
- Cascade delete sem confirmação

---

### 16. Atualizar Status do Convidado (Admin)

```
PATCH /api/eventos/convidados/status
PUT /api/eventos/convidados/status
```

**Headers:**

```
Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579
Content-Type: application/json
```

**Body:**

```json
{
  "email": "joao@exemplo.com",
  "status": "confirmado"
}
```

**Exemplo:**

```bash
curl -X PUT http://localhost:3002/api/eventos/convidados/status \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "status": "confirmado"
  }'
```

**Resposta:**

```json
{
  "sucesso": true,
  "mensagem": "Status atualizado com sucesso",
  "data": {
    "status": "confirmado",
    "evento": {
      "nome": "Show de Rock",
      "data": "2025-08-15T20:00:00.000Z",
      "local": "Estádio do Rock"
    }
  }
}
```

**🎯 VULNERABILIDADES:**

- Weak authentication
- Input validation bypass
- Enumeration de emails

---

## 🎯 Status Possíveis

- `"pendente"` - Convite enviado, aguardando confirmação
- `"confirmado"` - Convidado confirmou presença
- `"cancelado"` - Convite cancelado

---

## 🔍 Principais Vulnerabilidades para Teste

### 1. 🔐 Autenticação Fraca

- Hash hardcoded no código
- Sem rate limiting
- Sem expiração de token
- Weak token validation

### 2. 📊 Information Disclosure

- Dados pessoais expostos (CPF, email, telefone)
- Métricas de negócio
- Enumeration de recursos
- IDs sequenciais

### 3. 🔍 IDOR (Insecure Direct Object Reference)

- Acesso a eventos de outros usuários
- Acesso a convidados de outros eventos
- Mass assignment

### 4. 💉 Input Validation

- XSS via campos de texto
- SSRF via URLs
- SQL Injection (improvável com Prisma)
- Email validation bypass

### 5. 🌐 CORS Misconfiguration

- CORS muito permissivo
- Credentials habilitados

### 6. ⚡ Enumeration

- IDs sequenciais
- CPFs válidos
- Emails válidos
- Eventos existentes

### 7. 🔢 Authorization Bypass

- Tentar acessar endpoints admin sem token
- Weak token validation

---

## 🛠️ Ferramentas Recomendadas

- **Burp Suite** para interceptação e análise
- **OWASP ZAP** para testes automatizados
- **Postman** para testes manuais
- **SQLMap** (se necessário)
- **Nuclei** para templates de vulnerabilidades
- **cURL** para testes rápidos

---

## 🚀 Exemplos de Teste Rápido

### Teste de Enumeration

```bash
# Testar IDs sequenciais
for i in {1..10}; do
  curl -X GET http://localhost:3002/api/eventos/$i
done
```

### Teste de Brute Force

```bash
# Testar hashes comuns
for hash in "admin" "123456" "password" "teste"; do
  curl -X POST http://localhost:3002/api/admin/verificar-hash \
    -H "Content-Type: application/json" \
    -d "{\"hash\":\"$hash\"}"
done
```

### Teste de XSS

```bash
# Testar XSS no nome do evento
curl -X POST http://localhost:3002/api/eventos \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "<script>alert(\"XSS\")</script>",
    "descricao": "Teste",
    "data": "2025-12-31T20:00:00Z",
    "local": "Teste",
    "preco": 100,
    "ingressosDisponiveis": 50,
    "ingressosTotal": 100
  }'
```

---

## 📝 Notas Importantes

1. **IDs Numéricos:** Eventos usam IDs numéricos auto-incremento (1, 2, 3, etc.)
2. **Hash Admin:** Hash hardcoded conhecido para testes
3. **CORS:** Configurado para localhost:3000 e localhost:3001
4. **Validação:** Usa class-validator com whitelist
5. **Banco:** SQLite com Prisma ORM
6. **Porta:** API roda na porta 3002

---

## 🔒 Recomendações de Segurança

1. **Implementar Rate Limiting**
2. **Usar JWT em vez de hash hardcoded**
3. **Adicionar validação mais rigorosa**
4. **Implementar logging de auditoria**
5. **Adicionar CSRF protection**
6. **Implementar session management**
7. **Adicionar input sanitization**
8. **Implementar proper error handling**

---

**⚠️ AVISO:** Esta API foi criada para fins educacionais e de teste de vulnerabilidades. Não use em produção!

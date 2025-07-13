# 🎯 Resumo Executivo - TicketPlatform API

## 🚀 Informações Rápidas

- **URL:** `http://localhost:3002/api`
- **Hash Admin:** `d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579`
- **Porta:** 3002

---

## 🔥 Principais Vulnerabilidades

### 1. 🔐 Autenticação Fraca

- **Hash hardcoded** no código
- **Sem rate limiting**
- **Sem expiração de token**
- **Weak token validation**

### 2. 📊 Information Disclosure

- **CPFs expostos** em várias rotas
- **Emails expostos** publicamente
- **Métricas de negócio** acessíveis
- **IDs sequenciais** (1, 2, 3...)

### 3. 🔍 IDOR (Insecure Direct Object Reference)

- Acesso a **eventos de outros usuários**
- Acesso a **convidados de outros eventos**
- **Mass assignment** possível

### 4. 💉 Input Validation

- **XSS** via campos de texto
- **SSRF** via URLs
- **Email validation bypass**
- **SQL Injection** (improvável com Prisma)

---

## 🎯 Endpoints para Teste Rápido

### Endpoints Públicos (Sem Auth)

| Método | Endpoint                         | Descrição         | Vulnerabilidade        |
| ------ | -------------------------------- | ----------------- | ---------------------- |
| GET    | `/api/eventos`                   | Listar eventos    | Information disclosure |
| GET    | `/api/eventos/{id}`              | Buscar evento     | IDOR, Enumeration      |
| GET    | `/api/eventos/{id}/convidados`   | Listar convidados | IDOR, Data exposure    |
| POST   | `/api/eventos/convidados`        | Criar convidado   | Input validation       |
| POST   | `/api/eventos/convidados/status` | Consultar status  | Enumeration            |

### Endpoints Admin (Com Auth)

| Método    | Endpoint                         | Descrição        | Vulnerabilidade        |
| --------- | -------------------------------- | ---------------- | ---------------------- |
| POST      | `/api/admin/login`               | Login admin      | Weak auth              |
| GET       | `/api/admin/dashboard`           | Dashboard        | Information disclosure |
| POST      | `/api/eventos`                   | Criar evento     | XSS, SSRF              |
| PUT/PATCH | `/api/eventos/convidados/status` | Atualizar status | Input validation       |

---

## 🚀 Testes Rápidos

### 1. Enumeration de Eventos

```bash
# Testar IDs sequenciais
for i in {1..10}; do
  curl -X GET http://localhost:3002/api/eventos/$i
done
```

### 2. Brute Force Hash

```bash
# Testar hashes comuns
for hash in "admin" "123456" "password" "teste"; do
  curl -X POST http://localhost:3002/api/admin/verificar-hash \
    -H "Content-Type: application/json" \
    -d "{\"hash\":\"$hash\"}"
done
```

### 3. XSS Test

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

### 4. IDOR Test

```bash
# Tentar acessar evento inexistente
curl -X GET http://localhost:3002/api/eventos/999

# Tentar acessar convidados de outro evento
curl -X GET http://localhost:3002/api/eventos/1/convidados
```

### 5. Information Disclosure

```bash
# Verificar dados expostos
curl -X GET http://localhost:3002/api/eventos/1/convidados

# Consultar status com CPF/email
curl -X POST http://localhost:3002/api/eventos/convidados/status \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com"}'
```

---

## 🎯 Fluxo de Teste Recomendado

### 1. Reconhecimento

```bash
# Verificar endpoints disponíveis
curl -X GET http://localhost:3002/api/eventos
curl -X GET http://localhost:3002/api
```

### 2. Enumeration

```bash
# Enumerar eventos
for i in {1..5}; do
  curl -X GET http://localhost:3002/api/eventos/$i
done
```

### 3. Information Gathering

```bash
# Coletar dados de convidados
curl -X GET http://localhost:3002/api/eventos/1/convidados
```

### 4. Authentication Testing

```bash
# Testar autenticação
curl -X POST http://localhost:3002/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"hash":"d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"}'
```

### 5. Authorization Testing

```bash
# Testar acesso sem token
curl -X GET http://localhost:3002/api/admin/dashboard

# Testar com token válido
curl -X GET http://localhost:3002/api/admin/dashboard \
  -H "Authorization: Bearer d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
```

### 6. Input Validation Testing

```bash
# Testar XSS
curl -X POST http://localhost:3002/api/eventos/convidados \
  -H "Content-Type: application/json" \
  -d '{"nome":"<script>alert(1)</script>","cpf":"123.456.789-00","eventoId":1}'

# Testar email inválido
curl -X POST http://localhost:3002/api/eventos/convidados \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","cpf":"123.456.789-00","eventoId":1,"email":"email-invalido"}'
```

---

## 🔧 Ferramentas Recomendadas

- **Burp Suite** - Interceptação e análise
- **OWASP ZAP** - Testes automatizados
- **Postman** - Testes manuais
- **cURL** - Testes rápidos
- **Nuclei** - Templates de vulnerabilidades

---

## ⚠️ Vulnerabilidades Críticas

1. **Hash hardcoded** - Autenticação comprometida
2. **Information disclosure** - Dados pessoais expostos
3. **IDOR** - Acesso não autorizado a recursos
4. **XSS** - Possível execução de scripts
5. **Enumeration** - Enumeration de recursos

---

## 🎯 Próximos Passos

1. **Testar todas as rotas** listadas
2. **Verificar cada vulnerabilidade** mencionada
3. **Documentar findings** encontrados
4. **Propor correções** de segurança
5. **Implementar mitigations** adequadas

---

**📚 Documentação Completa:** `API_DOCUMENTATION.md`

**⚠️ AVISO:** API criada para fins educacionais e teste de vulnerabilidades!

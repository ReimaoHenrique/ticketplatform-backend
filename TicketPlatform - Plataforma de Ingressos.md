# TicketPlatform - Plataforma de Ingressos

Uma plataforma moderna e responsiva para venda e verificação de ingressos de eventos, desenvolvida com Next.js 15, TypeScript e Shadcn UI.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn UI** - Biblioteca de componentes
- **Lucide React** - Ícones modernos
- **next-themes** - Sistema de temas (modo claro/escuro)

## 📋 Funcionalidades

### 🏠 Página Home (/)
- Exibição de informações do evento
- Imagem do evento com overlay
- Descrição detalhada do evento
- Quantidade de ingressos disponíveis
- Preço por ingresso
- Barra de progresso de vendas
- Termos de uso
- Botão para compra (redirecionamento externo)
- Link para verificação de ingresso

### 🔍 Página Verificar (/verificar)
- Formulário de consulta por CPF ou Nome
- Validação e formatação automática de CPF
- Exibição de resultados da consulta
- Detalhes completos do ingresso encontrado
- Mensagens de erro e sucesso
- Interface responsiva

### 👨‍💼 Página Admin (/admin)
- Sistema de login protegido por hash
- Dashboard com métricas resumidas
- Cards de lucro atual e potencial
- Estatísticas de ingressos vendidos
- Tabela completa de festas cadastradas
- Informações detalhadas de cada evento
- Sistema de logout

### 🌙 Sistema de Temas
- **Alternância modo claro/escuro** - Botão toggle no header
- **Persistência de preferência** - Tema salvo no localStorage
- **Detecção automática** - Respeita preferência do sistema
- **Transições suaves** - Mudanças animadas entre temas
- **Compatibilidade total** - Todos os componentes adaptados

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd plataforma-ingressos

# Instale as dependências
npm install

# Execute o projeto em desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🔑 Credenciais de Acesso

### Admin
- **Hash de acesso**: `d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579`

### Dados de Teste para Verificação
- **CPF**: 123.456.789-00 (João Silva)
- **CPF**: 987.654.321-00 (Maria Santos)
- **CPF**: 456.789.123-00 (Pedro Oliveira)
- **Nome**: João Silva, Maria Santos, Pedro Oliveira

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── admin/             # Página de administração
│   ├── verificar/         # Página de verificação
│   ├── api/               # API Routes
│   │   ├── admin/festas/  # Endpoint admin
│   │   ├── ingresso/consultar/ # Endpoint consulta
│   │   └── ingressos/disponiveis/ # Endpoint disponibilidade
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página home
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes Shadcn UI
│   ├── header.tsx        # Cabeçalho
│   └── footer.tsx        # Rodapé
├── lib/                  # Utilitários e configurações
│   ├── constants.ts      # Constantes do projeto
│   ├── mock-data.ts      # Dados mockados
│   ├── utils.ts          # Utilitários Shadcn
│   └── validations.ts    # Funções de validação
└── types/                # Definições TypeScript
    └── index.ts          # Interfaces e tipos
```

## 🎨 Design e UX

- **Design responsivo** - Funciona em desktop, tablet e mobile
- **Tema consistente** - Paleta de cores neutra e profissional
- **Componentes acessíveis** - Seguindo padrões de acessibilidade
- **Feedback visual** - Loading states, mensagens de erro/sucesso
- **Navegação intuitiva** - Menu claro e breadcrumbs

## 🔌 APIs Implementadas

### GET /api/ingressos/disponiveis
Retorna informações sobre ingressos disponíveis para o evento.

### POST /api/ingresso/consultar
Consulta ingresso por CPF ou nome.
```json
{
  "cpf": "123.456.789-00",
  "nome": "João Silva"
}
```

### GET /api/admin/festas
Lista todas as festas (requer autenticação).

### POST /api/admin/festas
Login administrativo.
```json
{
  "hash": "d02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579"
}
```

## 🚀 Deploy

O projeto está pronto para deploy no Vercel:

```bash
# Build de produção
npm run build

# Deploy no Vercel
npx vercel
```

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting do código

## 🔒 Segurança

- Hash de admin armazenado em constantes
- Validação de entrada nos formulários
- Sanitização de dados
- Autenticação persistente via localStorage
- Mascaramento de campos sensíveis

## 🎯 Próximos Passos

- Integração com gateway de pagamento real
- Sistema de autenticação JWT
- Banco de dados real (PostgreSQL/MongoDB)
- Notificações por email/SMS
- Sistema de relatórios avançados
- Testes automatizados

## 📄 Licença

Este projeto foi desenvolvido como demonstração técnica.

---

**Desenvolvido com ❤️ usando Next.js e Shadcn UI**


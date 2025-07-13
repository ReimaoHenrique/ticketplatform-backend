-- CreateTable
CREATE TABLE "eventos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "convidados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "cpf" TEXT,
    "eventoId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "convidados_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_hash_key" ON "admins"("hash");

-- CreateIndex
CREATE INDEX "convidados_eventoId_idx" ON "convidados"("eventoId");

-- CreateIndex
CREATE INDEX "convidados_status_idx" ON "convidados"("status");

-- CreateIndex
CREATE INDEX "convidados_email_idx" ON "convidados"("email");

-- CreateIndex
CREATE INDEX "convidados_cpf_idx" ON "convidados"("cpf");

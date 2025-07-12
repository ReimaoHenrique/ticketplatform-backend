-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ingressos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventoId" TEXT NOT NULL,
    "nomeEvento" TEXT,
    "cpf" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "hash" TEXT NOT NULL,
    "dataCompra" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ingressos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ingressos" ("cpf", "createdAt", "dataCompra", "email", "eventoId", "hash", "id", "nome", "nomeEvento", "status", "updatedAt") SELECT "cpf", "createdAt", "dataCompra", "email", "eventoId", "hash", "id", "nome", "nomeEvento", "status", "updatedAt" FROM "ingressos";
DROP TABLE "ingressos";
ALTER TABLE "new_ingressos" RENAME TO "ingressos";
CREATE UNIQUE INDEX "ingressos_hash_key" ON "ingressos"("hash");
CREATE INDEX "ingressos_cpf_idx" ON "ingressos"("cpf");
CREATE INDEX "ingressos_hash_idx" ON "ingressos"("hash");
CREATE INDEX "ingressos_status_idx" ON "ingressos"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

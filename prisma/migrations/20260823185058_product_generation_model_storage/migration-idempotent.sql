-- Versão idempotente — segura para correr mesmo que parte já tenha sido aplicada.

-- Enum de armazenamento (novo)
DO $$ BEGIN
  CREATE TYPE "StorageCapacity" AS ENUM ('500GB', '1TB', '2TB');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Troca do enum de geração (remove PS1/PS2/PS3) — só corre se ainda não foi aplicada
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'PsGeneration' AND e.enumlabel = 'PS1'
  ) THEN
    UPDATE "Product" SET "psGeneration" = 'NA' WHERE "psGeneration" IN ('PS1', 'PS2', 'PS3');
    CREATE TYPE "PsGeneration_new" AS ENUM ('PS4', 'PS5', 'NA');
    ALTER TABLE "Product" ALTER COLUMN "psGeneration" DROP DEFAULT;
    ALTER TABLE "Product" ALTER COLUMN "psGeneration" TYPE "PsGeneration_new" USING ("psGeneration"::text::"PsGeneration_new");
    ALTER TYPE "PsGeneration" RENAME TO "PsGeneration_old";
    ALTER TYPE "PsGeneration_new" RENAME TO "PsGeneration";
    DROP TYPE "PsGeneration_old";
    ALTER TABLE "Product" ALTER COLUMN "psGeneration" SET DEFAULT 'NA';
  END IF;
END $$;

-- Novas colunas no Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "model" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "storageCapacity" "StorageCapacity";

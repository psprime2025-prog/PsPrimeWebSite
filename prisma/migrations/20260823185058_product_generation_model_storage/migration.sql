-- Guarda de segurança: se alguma linha existente referenciar PS1/PS2/PS3
-- (não deveria haver, mas evita que a migração falhe a meio).
UPDATE "Product" SET "psGeneration" = 'NA' WHERE "psGeneration" IN ('PS1', 'PS2', 'PS3');

-- CreateEnum
CREATE TYPE "StorageCapacity" AS ENUM ('500GB', '1TB', '2TB');

-- AlterEnum
BEGIN;
CREATE TYPE "PsGeneration_new" AS ENUM ('PS4', 'PS5', 'NA');
ALTER TABLE "public"."Product" ALTER COLUMN "psGeneration" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "psGeneration" TYPE "PsGeneration_new" USING ("psGeneration"::text::"PsGeneration_new");
ALTER TYPE "PsGeneration" RENAME TO "PsGeneration_old";
ALTER TYPE "PsGeneration_new" RENAME TO "PsGeneration";
DROP TYPE "public"."PsGeneration_old";
ALTER TABLE "Product" ALTER COLUMN "psGeneration" SET DEFAULT 'NA';
COMMIT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "model" TEXT,
ADD COLUMN     "storageCapacity" "StorageCapacity";

-- Versão idempotente para correr manualmente no SQL Editor do Supabase (produção).
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "includedItems" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "testedChecks" TEXT[] DEFAULT ARRAY[]::TEXT[];

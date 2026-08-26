-- CreateEnum
CREATE TYPE "SellRequestStatus" AS ENUM ('NOVO', 'CONTACTADO', 'FECHADO');

-- CreateTable
CREATE TABLE "SellRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "consoleModel" TEXT NOT NULL,
    "storageCapacity" TEXT,
    "condition" TEXT NOT NULL,
    "message" TEXT,
    "status" "SellRequestStatus" NOT NULL DEFAULT 'NOVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellRequest_status_idx" ON "SellRequest"("status");

-- CreateIndex
CREATE INDEX "SellRequest_createdAt_idx" ON "SellRequest"("createdAt");

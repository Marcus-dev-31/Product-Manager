-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'EDITOR';
COMMIT;

-- AlterTable: agregar como opcional primero
ALTER TABLE "Business" ADD COLUMN "inviteCode" TEXT;

-- Poblar filas existentes con un UUID
UPDATE "Business" SET "inviteCode" = gen_random_uuid()::text WHERE "inviteCode" IS NULL;

-- Hacer la columna requerida
ALTER TABLE "Business" ALTER COLUMN "inviteCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'EDITOR';

-- CreateIndex
CREATE UNIQUE INDEX "Business_inviteCode_key" ON "Business"("inviteCode");
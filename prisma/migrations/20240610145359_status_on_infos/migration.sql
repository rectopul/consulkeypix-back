/*
  Warnings:

  - Added the required column `status` to the `infos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "infos" ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "telegram_settings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "telegram_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_settings_token_key" ON "telegram_settings"("token");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_settings_group_id_key" ON "telegram_settings"("group_id");

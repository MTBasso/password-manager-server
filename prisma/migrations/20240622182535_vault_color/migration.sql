/*
  Warnings:

  - Added the required column `color` to the `Vault` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vault" ADD COLUMN     "color" TEXT NOT NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[roleName]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Roles_roleName_key" ON "Roles"("roleName");

/*
  Warnings:

  - A unique constraint covering the columns `[petId]` on the table `PetGroomingPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PetGroomingPreference_petId_key" ON "PetGroomingPreference"("petId");

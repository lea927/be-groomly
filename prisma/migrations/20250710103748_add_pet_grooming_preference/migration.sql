-- CreateEnum
CREATE TYPE "PetCoatType" AS ENUM ('SHORT', 'MEDIUM', 'LONG', 'CURLY', 'WIRE');

-- CreateEnum
CREATE TYPE "PetTemperament" AS ENUM ('CALM', 'FRIENDLY', 'PLAYFUL', 'AGGRESSIVE', 'SHY', 'ANXIOUS');

-- CreateTable
CREATE TABLE "PetGroomingPreference" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "coatType" "PetCoatType",
    "temperament" "PetTemperament",
    "specialInstructions" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetGroomingPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PetGroomingPreference" ADD CONSTRAINT "PetGroomingPreference_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

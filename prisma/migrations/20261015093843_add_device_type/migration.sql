-- AlterTable
ALTER TABLE "device_models" ADD COLUMN     "deviceTypeId" TEXT;

-- CreateTable
CREATE TABLE "device_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_types_slug_key" ON "device_types"("slug");

-- AddForeignKey
ALTER TABLE "device_models" ADD CONSTRAINT "device_models_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "device_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "SavedView" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT,
    "search" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedView_organizationId_idx" ON "SavedView"("organizationId");

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

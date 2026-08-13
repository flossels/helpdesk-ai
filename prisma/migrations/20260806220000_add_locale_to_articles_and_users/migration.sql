
-- DropIndex
DROP INDEX "Article_slug_key";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "sourceArticleId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredLocale" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_locale_key" ON "Article"("slug", "locale");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_sourceArticleId_fkey" FOREIGN KEY ("sourceArticleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;


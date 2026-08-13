-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "autoCategorizationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoSentimentEnabled" BOOLEAN NOT NULL DEFAULT false;

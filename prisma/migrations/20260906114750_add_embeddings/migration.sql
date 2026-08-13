CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "ArticleEmbedding" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "ArticleEmbedding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TicketEmbedding" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "TicketEmbedding_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ArticleEmbedding_articleId_idx" ON "ArticleEmbedding"("articleId");
CREATE INDEX "TicketEmbedding_ticketId_idx" ON "TicketEmbedding"("ticketId");

ALTER TABLE "ArticleEmbedding" ADD CONSTRAINT "ArticleEmbedding_articleId_fkey"
    FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TicketEmbedding" ADD CONSTRAINT "TicketEmbedding_ticketId_fkey"
    FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX article_embedding_idx ON "ArticleEmbedding" USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ticket_embedding_idx ON "TicketEmbedding" USING hnsw (embedding vector_cosine_ops);

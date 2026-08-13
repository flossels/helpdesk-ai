CREATE INDEX "Ticket_search_idx" ON "Ticket"
    USING GIN (to_tsvector('english', subject || ' ' || description));
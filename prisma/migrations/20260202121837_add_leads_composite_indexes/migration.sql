-- CreateIndex
CREATE INDEX "leads_user_id_converted_at_idx" ON "leads"("user_id", "converted_at" DESC);

-- CreateIndex
CREATE INDEX "leads_user_id_link_id_converted_at_idx" ON "leads"("user_id", "link_id", "converted_at" DESC);

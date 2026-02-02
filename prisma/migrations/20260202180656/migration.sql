/*
  Warnings:

  - A unique constraint covering the columns `[user_id,slug]` on the table `links` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "links_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "links_user_id_slug_key" ON "links"("user_id", "slug");

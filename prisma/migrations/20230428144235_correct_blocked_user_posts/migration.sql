/*
  Warnings:

  - You are about to drop the `blockedUserPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blockedUserPost" DROP CONSTRAINT "blockedUserPost_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "blockedUserPost" DROP CONSTRAINT "blockedUserPost_mediaPostId_fkey";

-- DropTable
DROP TABLE "blockedUserPost";

-- CreateTable
CREATE TABLE "_blocked-user-post" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blocked-user-post_AB_unique" ON "_blocked-user-post"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked-user-post_B_index" ON "_blocked-user-post"("B");

-- AddForeignKey
ALTER TABLE "_blocked-user-post" ADD CONSTRAINT "_blocked-user-post_A_fkey" FOREIGN KEY ("A") REFERENCES "mediaPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked-user-post" ADD CONSTRAINT "_blocked-user-post_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `BlockedUserPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlockedUserPost" DROP CONSTRAINT "BlockedUserPost_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "BlockedUserPost" DROP CONSTRAINT "BlockedUserPost_mediaPostId_fkey";

-- DropForeignKey
ALTER TABLE "MediaPost" DROP CONSTRAINT "MediaPost_creatorId_fkey";

-- DropTable
DROP TABLE "BlockedUserPost";

-- DropTable
DROP TABLE "MediaPost";

-- CreateTable
CREATE TABLE "mediaPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mediaPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockedUserPost" (
    "id" SERIAL NOT NULL,
    "blockedId" INTEGER NOT NULL,
    "mediaPostId" INTEGER NOT NULL,

    CONSTRAINT "blockedUserPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mediaPost" ADD CONSTRAINT "mediaPost_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedUserPost" ADD CONSTRAINT "blockedUserPost_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedUserPost" ADD CONSTRAINT "blockedUserPost_mediaPostId_fkey" FOREIGN KEY ("mediaPostId") REFERENCES "mediaPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

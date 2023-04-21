-- CreateTable
CREATE TABLE "BlockedUsers" (
    "id" SERIAL NOT NULL,
    "blockedId" INTEGER NOT NULL,
    "blockerId" INTEGER NOT NULL,

    CONSTRAINT "BlockedUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

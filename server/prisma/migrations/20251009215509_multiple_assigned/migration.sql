/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_assignedTo_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignedTo";

-- CreateTable
CREATE TABLE "_UserTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserTasks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserTasks_B_index" ON "_UserTasks"("B");

-- AddForeignKey
ALTER TABLE "_UserTasks" ADD CONSTRAINT "_UserTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTasks" ADD CONSTRAINT "_UserTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalTaskAchievementState" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "count" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "TotalTaskAchievementState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TotalTaskAchievementState_user_id_key" ON "TotalTaskAchievementState"("user_id");

-- AddForeignKey
ALTER TABLE "TotalTaskAchievementState" ADD CONSTRAINT "TotalTaskAchievementState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

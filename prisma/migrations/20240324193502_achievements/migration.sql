-- AlterTable
ALTER TABLE "TotalTaskAchievementState" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "FlawlessCompletionAchievementState" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "count" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "FlawlessCompletionAchievementState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointsCompletionAchievementState" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "count" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "PointsCompletionAchievementState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCompletionAchievementState" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "count" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "DailyCompletionAchievementState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeekendCompletionAchievementState" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "count" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "WeekendCompletionAchievementState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopCompletionAchievementState" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "count" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "TopCompletionAchievementState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlawlessCompletionAchievementState_user_id_key" ON "FlawlessCompletionAchievementState"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PointsCompletionAchievementState_user_id_key" ON "PointsCompletionAchievementState"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCompletionAchievementState_user_id_key" ON "DailyCompletionAchievementState"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "WeekendCompletionAchievementState_user_id_key" ON "WeekendCompletionAchievementState"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TopCompletionAchievementState_user_id_key" ON "TopCompletionAchievementState"("user_id");

-- AddForeignKey
ALTER TABLE "FlawlessCompletionAchievementState" ADD CONSTRAINT "FlawlessCompletionAchievementState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsCompletionAchievementState" ADD CONSTRAINT "PointsCompletionAchievementState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyCompletionAchievementState" ADD CONSTRAINT "DailyCompletionAchievementState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekendCompletionAchievementState" ADD CONSTRAINT "WeekendCompletionAchievementState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopCompletionAchievementState" ADD CONSTRAINT "TopCompletionAchievementState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "DailyCompletionAchievementState" ADD COLUMN     "last_completion" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WeekendCompletionAchievementState" ADD COLUMN     "last_completion" TIMESTAMP(3);

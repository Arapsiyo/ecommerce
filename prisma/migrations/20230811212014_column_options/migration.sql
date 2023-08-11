-- AlterTable
ALTER TABLE "User" ALTER COLUMN "forgotPasswordToken" DROP NOT NULL,
ALTER COLUMN "forgotPasswordTokenExpiry" DROP NOT NULL,
ALTER COLUMN "verifyToken" DROP NOT NULL,
ALTER COLUMN "verifyTokenExpiry" DROP NOT NULL;

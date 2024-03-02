/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `transactions` MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `avatar` VARCHAR(191) NULL,
    MODIFY `number_phone` VARCHAR(20) NOT NULL;

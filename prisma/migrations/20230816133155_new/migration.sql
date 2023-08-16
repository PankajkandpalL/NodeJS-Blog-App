-- CreateTable
CREATE TABLE `Role` (
    `type` VARCHAR(191) NOT NULL,
    `permissionsId` INTEGER NOT NULL,

    UNIQUE INDEX `Role_type_key`(`type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `canUpdatePost` BOOLEAN NOT NULL DEFAULT false,
    `canDisableUser` BOOLEAN NOT NULL DEFAULT false,
    `canEnableUser` BOOLEAN NOT NULL DEFAULT false,
    `canDeletePost` BOOLEAN NOT NULL DEFAULT false,
    `canDeleteAnyPost` BOOLEAN NOT NULL DEFAULT false,
    `canReadPosts` BOOLEAN NOT NULL DEFAULT false,
    `canUploadImages` BOOLEAN NOT NULL DEFAULT false,
    `canCreatePost` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Permissions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(1000) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `roleType` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `description` VARCHAR(1000) NOT NULL,
    `imageSrc` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedBy` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Post_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_permissionsId_fkey` FOREIGN KEY (`permissionsId`) REFERENCES `Permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleType_fkey` FOREIGN KEY (`roleType`) REFERENCES `Role`(`type`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

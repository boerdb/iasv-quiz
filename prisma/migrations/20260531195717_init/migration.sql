-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_text` TEXT NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `option_a` VARCHAR(500) NOT NULL,
    `option_b` VARCHAR(500) NOT NULL,
    `option_c` VARCHAR(500) NOT NULL,
    `option_d` VARCHAR(500) NOT NULL,
    `correct_option` ENUM('A', 'B', 'C', 'D') NOT NULL,
    `explanation` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `difficulty` INTEGER NOT NULL DEFAULT 1,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player_name` VARCHAR(100) NOT NULL,
    `score` INTEGER NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `selected_option` ENUM('A', 'B', 'C', 'D') NOT NULL,
    `is_correct` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `quiz_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

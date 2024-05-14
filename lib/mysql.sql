-- Check if the database exists and create it if necessary
CREATE DATABASE IF NOT EXISTS quizdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE quizdb;

-- Drop tables if they exist to avoid duplication
DROP TABLE IF EXISTS species;
DROP TABLE IF EXISTS quizzes;

-- Create the quizzes table
CREATE TABLE quizzes (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         token VARCHAR(255) UNIQUE NOT NULL,
                         -- SCIENTIFIC = 1, COMMON = 2, BOTH = 3, default = 3
                         question_type ENUM('1', '2', '3') NOT NULL, 
                         quantity_question INT,
                         createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- Create the species table
CREATE TABLE species (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         scientific_name VARCHAR(255) NOT NULL,
                         common_name VARCHAR(255) NOT NULL,
                         image_url VARCHAR(255),
                         url VARCHAR(255),
                         user_login VARCHAR(255),
                         license VARCHAR(255), -- Updated to reflect license requirement
                         taxon_class_name VARCHAR(255),
                         taxon_order_name VARCHAR(255),
                         taxon_family_name VARCHAR(255),
                         taxon_genus_name VARCHAR(255),
                         taxon_species_name VARCHAR(255),
                         quiz_id INT,
                         INDEX idx_quiz_id (quiz_id),
                         FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Set up an automatic event to clear old data from quizzes and species tables
DELIMITER //
CREATE EVENT IF NOT EXISTS delete_old_data
    ON SCHEDULE EVERY 1 DAY
    DO
BEGIN
DELETE FROM quizzes WHERE createdAt < NOW() - INTERVAL 7 DAY;
END;
//
DELIMITER ;
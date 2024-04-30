-- Check if the database exists and create it if necessary
CREATE DATABASE IF NOT EXISTS quizdb;
USE quizdb;

-- Drop tables if they exist to avoid duplication
DROP TABLE IF EXISTS species;
DROP TABLE IF EXISTS quizzes;

-- Create the quizzes table
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    question_type ENUM('scientific', 'common', 'both'),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the species table
CREATE TABLE species (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scientific_name VARCHAR(255) NOT NULL,
    common_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    url VARCHAR(255),
    user_login VARCHAR(255),
    user_name VARCHAR(255),
    quiz_id INT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

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

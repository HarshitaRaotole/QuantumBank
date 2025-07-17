-- Create database
CREATE DATABASE IF NOT EXISTS edutrack;
USE edutrack;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status ENUM('pending', 'in_progress', 'submitted') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Sample data (optional)
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2a$10$example_hashed_password');

INSERT INTO subjects (user_id, name, color) VALUES 
(1, 'Mathematics', '#3b82f6'),
(1, 'Physics', '#ef4444'),
(1, 'Chemistry', '#10b981'),
(1, 'History', '#f59e0b');

INSERT INTO assignments (user_id, subject_id, title, description, due_date, status) VALUES 
(1, 1, 'Calculus Problem Set', 'Complete problems 1-20 from chapter 5', '2024-01-15', 'pending'),
(1, 2, 'Lab Report - Pendulum', 'Write lab report on pendulum experiment', '2024-01-18', 'in_progress'),
(1, 3, 'Chemical Bonding Essay', 'Essay on ionic and covalent bonding', '2024-01-20', 'pending'),
(1, 4, 'World War II Research', 'Research paper on WWII causes', '2024-01-25', 'submitted');

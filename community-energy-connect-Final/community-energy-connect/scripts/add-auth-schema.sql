-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_type ENUM('user', 'provider', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add user_id to service_providers table
ALTER TABLE service_providers 
ADD COLUMN user_id INT UNIQUE,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add email column to service_providers if not exists
ALTER TABLE service_providers
ADD COLUMN email VARCHAR(255) UNIQUE; 
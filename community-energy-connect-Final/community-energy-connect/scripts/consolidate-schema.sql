-- Create service_providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS service_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100),
    contact_name VARCHAR(100),
    phone_number VARCHAR(20),
    location VARCHAR(100),
    description TEXT,
    services TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create services table if it doesn't exist
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    features TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    image_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    specifications TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    image_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Migrate data if old tables exist
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'community_energy_connect' AND table_name = 'provider_services');
SET @sql = IF(@table_exists > 0, 
    'INSERT IGNORE INTO services (provider_id, name, description, price, features, category, subcategory, image_url) SELECT provider_id, title, description, pricing, features, category, subcategory, image_url FROM provider_services',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'community_energy_connect' AND table_name = 'provider_products');
SET @sql = IF(@table_exists > 0,
    'INSERT IGNORE INTO products (provider_id, name, description, price, specifications, category, subcategory, image_url) SELECT provider_id, title, description, pricing, specifications, category, subcategory, image_url FROM provider_products',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop old tables if they exist
DROP TABLE IF EXISTS provider_services;
DROP TABLE IF EXISTS provider_products; 
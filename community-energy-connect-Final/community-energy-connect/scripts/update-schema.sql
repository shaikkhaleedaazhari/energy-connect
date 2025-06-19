-- Add missing columns to services table if they don't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS features TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
ALTER TABLE services ADD COLUMN IF NOT EXISTS provider_id INT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS subcategory VARCHAR(50);
ALTER TABLE services ADD FOREIGN KEY IF NOT EXISTS (provider_id) REFERENCES service_providers(id);

-- Add missing columns to products table if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80';
ALTER TABLE products ADD COLUMN IF NOT EXISTS provider_id INT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(50);
ALTER TABLE products ADD FOREIGN KEY IF NOT EXISTS (provider_id) REFERENCES service_providers(id);

-- Make sure the users table has the correct structure
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- Make sure the service_providers table has the correct structure
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS company_name VARCHAR(100);
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS contact_name VARCHAR(100);
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS location VARCHAR(100);
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS services TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_products_provider_id ON products(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

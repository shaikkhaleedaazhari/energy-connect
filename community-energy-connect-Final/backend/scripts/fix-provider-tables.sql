-- Fix provider services table structure
ALTER TABLE provider_services ADD COLUMN IF NOT EXISTS features TEXT;
ALTER TABLE provider_services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Fix provider products table structure  
ALTER TABLE provider_products ADD COLUMN IF NOT EXISTS features TEXT;
ALTER TABLE provider_products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE provider_products ADD COLUMN IF NOT EXISTS specifications TEXT;

-- Update existing records with default image URLs
UPDATE provider_services SET image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80' WHERE image_url IS NULL;

UPDATE provider_products SET image_url = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80' WHERE image_url IS NULL;

-- Add some sample features for existing services
UPDATE provider_services SET features = 'Professional installation,Quality guarantee,24/7 support,Warranty included' WHERE features IS NULL;

-- Add some sample specifications for existing products
UPDATE provider_products SET specifications = 'High-quality materials,Energy efficient,Durable construction,Easy maintenance' WHERE specifications IS NULL;

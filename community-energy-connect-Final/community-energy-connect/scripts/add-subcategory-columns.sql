-- Add subcategory column to provider_services table
ALTER TABLE provider_services ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100) AFTER category;

-- Add subcategory column to provider_products table  
ALTER TABLE provider_products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100) AFTER category;

-- Update existing records with default subcategories based on category
UPDATE provider_services 
SET subcategory = CASE 
    WHEN category = 'Solar Energy Services' THEN 'Residential Solar Panel Installation'
    WHEN category = 'Energy Efficiency Services' THEN 'Home Energy Audits'
    WHEN category = 'Educational Workshops' THEN 'Renewable Energy Seminars'
    ELSE 'Other'
END 
WHERE subcategory IS NULL OR subcategory = '';

UPDATE provider_products 
SET subcategory = CASE 
    WHEN category = 'Renewable Energy Equipment' THEN 'Solar Panel Kits'
    WHEN category = 'Energy Efficiency Appliances' THEN 'LED Lighting'
    WHEN category = 'Home Energy Monitoring' THEN 'Energy Usage Monitors'
    ELSE 'Other'
END 
WHERE subcategory IS NULL OR subcategory = '';

-- Show updated table structures
DESCRIBE provider_services;
DESCRIBE provider_products;

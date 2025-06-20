-- Check if provider_services table exists and its structure
DESCRIBE provider_services;

-- Check if provider_products table exists and its structure  
DESCRIBE provider_products;

-- Check if service_providers table exists
DESCRIBE service_providers;

-- Show sample data from provider_services
SELECT * FROM provider_services LIMIT 5;

-- Show sample data from provider_products
SELECT * FROM provider_products LIMIT 5;

-- Show sample data from service_providers
SELECT * FROM service_providers LIMIT 5;

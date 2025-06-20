-- Create provider_services table
CREATE TABLE provider_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    pricing DECIMAL(10,2),
    availability VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Create provider_products table
CREATE TABLE provider_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    pricing DECIMAL(10,2),
    availability VARCHAR(100),
    quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Insert sample provider services
INSERT INTO provider_services (provider_id, title, description, category, pricing, availability, status) VALUES
(1, 'Solar Panel Installation', 'Complete solar panel installation service for residential properties', 'Residential Solar', 5000.00, 'Available', 'active'),
(1, 'Energy Audit', 'Comprehensive home energy efficiency assessment', 'Energy Efficiency', 200.00, 'Available', 'active'),
(2, 'Wind Turbine Maintenance', 'Professional maintenance service for wind turbines', 'Renewable Energy', 300.00, 'Limited', 'inactive');

-- Insert sample provider products
INSERT INTO provider_products (provider_id, title, description, category, pricing, availability, quantity, image_url, status) VALUES
(1, 'Smart Thermostat', 'Energy-efficient smart thermostat with WiFi connectivity', 'Energy Efficiency', 249.99, 'In Stock', 50, '/placeholder.svg?height=200&width=300', 'active'),
(1, 'LED Lighting Kit', 'Complete LED lighting solution for homes', 'Energy Efficiency', 89.99, 'In Stock', 25, '/placeholder.svg?height=200&width=300', 'active');

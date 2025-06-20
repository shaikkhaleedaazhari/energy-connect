-- Add products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10,2),
    image_url VARCHAR(255),
    specifications TEXT,
    availability ENUM('in_stock', 'out_of_stock', 'pre_order') DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products with stock images
INSERT INTO products (name, description, category, price, image_url, specifications) VALUES
-- Solar Panel Kits
('EcoSun Home Solar Kit', 'Complete solar panel system for home use', 'solar_panels', 2999.99, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Power: 5kW, Efficiency: 20%, Warranty: 25 years'),
('PowerUp Solar System', 'High-efficiency solar panels for maximum energy', 'solar_panels', 4599.99, 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Power: 8kW, Efficiency: 22%, Warranty: 25 years'),
('SunStream Energy Package', 'Affordable solar solution for small homes', 'solar_panels', 1899.99, 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Power: 3kW, Efficiency: 18%, Warranty: 20 years'),

-- Wind Turbines
('WhisperWind Turbine', 'Quiet and efficient wind turbine for residential use', 'wind_turbines', 3499.99, 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Power: 2kW, Height: 30ft, Wind Speed: 7-55 mph'),
('SkySail Home Turbine', 'Compact wind turbine for urban environments', 'wind_turbines', 2299.99, 'https://images.unsplash.com/photo-1548337138-e87d889cc369?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Power: 1kW, Height: 20ft, Wind Speed: 8-45 mph'),
('BreezeMaster Wind System', 'Powerful wind turbine for rural properties', 'wind_turbines', 5999.99, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Power: 5kW, Height: 50ft, Wind Speed: 6-60 mph'),

-- LED Lighting
('BrightLife LED Bulbs', 'Long-lasting and energy-efficient LED bulbs', 'led_lighting', 24.99, 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Wattage: 9W, Lumens: 800, Lifespan: 25,000 hours'),
('EcoGlow Smart Lighting', 'Smart LED lighting with dimming and color control', 'led_lighting', 89.99, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Wattage: 12W, Lumens: 1000, Smart Features: WiFi, Voice Control'),
('Luminos Energy Saver', 'Affordable LED bulbs for home and office', 'led_lighting', 12.99, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Wattage: 7W, Lumens: 600, Lifespan: 20,000 hours'),

-- Smart Thermostats
('ThermoWise Smart Thermostat', 'AI-powered thermostat for optimal energy savings', 'smart_thermostats', 249.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: WiFi, Learning Algorithm, Energy Reports'),
('ClimateControl Pro', 'Advanced thermostat with remote control and scheduling', 'smart_thermostats', 199.99, 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: WiFi, Mobile App, 7-day Programming'),
('EcoTemp Smart Home', 'User-friendly smart thermostat for any home', 'smart_thermostats', 149.99, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: WiFi, Touch Screen, Energy Saving Mode'),

-- Energy Monitors
('PowerWatch Home Monitor', 'Real-time energy usage monitoring for your home', 'energy_monitors', 179.99, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: Real-time monitoring, Mobile app, Cost tracking'),
('EnergyTrack Pro', 'Professional energy insight and savings recommendations', 'energy_monitors', 299.99, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: Advanced analytics, Solar monitoring, API access'),
('EcoSense Usage Meter', 'Simple and effective energy usage monitor', 'energy_monitors', 99.99, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: Basic monitoring, LED display, Easy setup'),

-- Smart Plugs
('PlugWise Smart Plugs', 'Control your appliances remotely and save energy', 'smart_plugs', 39.99, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: WiFi, Voice control, Energy monitoring'),
('EcoConnect Smart Outlets', 'Smart plugs with scheduling and energy monitoring', 'smart_plugs', 59.99, 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: WiFi, Scheduling, Usage tracking'),
('PowerLink Smart Home', 'Easy-to-use smart plugs for any device', 'smart_plugs', 29.99, 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'Features: WiFi, Mobile app, Timer function');

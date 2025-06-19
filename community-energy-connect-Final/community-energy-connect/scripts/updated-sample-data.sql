-- Insert sample service providers first (since they're referenced by services)
INSERT INTO service_providers (company_name, contact_name, phone_number, location, description, services) VALUES
('Solar Solutions Inc.', 'John Smith', '555-0123', 'Cityville', 'Leading provider of solar panel installation and maintenance services.', 'Solar panel installation, maintenance'),
('EcoHome Energy', 'Sarah Johnson', '555-0124', 'Townsville', 'Specialists in energy-efficient home upgrades.', 'Energy audits, insulation, window upgrades'),
('Wind Power Now', 'Mike Davis', '555-0125', 'Rural County', 'Experts in residential wind turbine installations.', 'Wind turbine installation, solar solutions');

-- Insert sample services linked to providers
INSERT INTO services (provider_id, name, description, category, subcategory, price, features, image_url) VALUES
(1, 'Solar Panel Installation', 'Professional installation of high-efficiency solar panels', 'solar', 'installation', 5000.00, 'Professional installation,10-year warranty,Free maintenance', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'),
(1, 'Solar Panel Maintenance', 'Regular maintenance and cleaning of solar panels', 'solar', 'maintenance', 200.00, 'Quarterly cleaning,Performance check,Repair service', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'),
(2, 'Home Energy Audit', 'Comprehensive home energy efficiency assessment', 'efficiency', 'audit', 300.00, 'Thermal imaging,Air leak detection,Written report', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'),
(3, 'Wind Turbine Installation', 'Complete wind turbine setup for homes', 'wind', 'installation', 7500.00, 'Site assessment,Professional installation,Warranty', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80');

-- Insert sample products linked to providers
INSERT INTO products (provider_id, name, description, category, subcategory, price, specifications, image_url) VALUES
(1, 'Premium Solar Panel Kit', 'High-efficiency solar panel system for residential use', 'solar', 'panels', 3000.00, '400W output,Monocrystalline,25-year warranty', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'),
(2, 'Smart Thermostat', 'WiFi-enabled smart thermostat for energy savings', 'efficiency', 'thermostats', 199.99, 'WiFi enabled,Mobile app,Energy usage reports', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'),
(3, 'Home Wind Turbine', 'Residential wind turbine for power generation', 'wind', 'turbines', 5000.00, '2kW output,20-year lifespan,Low noise design', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'); 
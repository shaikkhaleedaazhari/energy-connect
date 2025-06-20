-- Insert dummy products for existing provider (ID 4)
INSERT INTO products (provider_id, name, description, category, subcategory, price, specifications, image_url) VALUES
(4, 'Solar Panel Pro X1', 'High-efficiency monocrystalline solar panel for residential use', 'Solar Panels', 'Residential', 599.99, 
    '[
        "400W Power Output",
        "24.3% Efficiency",
        "25 Year Warranty",
        "Anti-reflective Coating",
        "Temperature Range: -40°C to 85°C"
    ]',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276'),
    
(4, 'PowerWall Battery', 'Advanced home energy storage solution', 'Batteries', 'Energy Storage', 1299.99,
    '[
        "13.5 kWh Capacity",
        "7kW Peak Power",
        "Built-in Inverter",
        "10 Year Warranty",
        "Smart Home Integration"
    ]',
    'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d'),
    
(4, 'Smart Inverter Pro', 'Intelligent solar inverter with monitoring', 'Inverters', 'Grid-Tie', 799.99,
    '[
        "6000W Output",
        "97.5% Efficiency",
        "WiFi Connectivity",
        "LCD Display",
        "Multiple MPPT Channels"
    ]',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837');

-- Insert dummy services for existing provider (ID 4)
INSERT INTO services (provider_id, name, description, category, subcategory, price, features, image_url) VALUES
(4, 'Solar Panel Installation', 'Professional installation of solar panel systems', 'Solar Installation', 'Residential', 2999.99,
    '[
        "Free Site Assessment",
        "Professional Installation Team",
        "Permit Handling",
        "System Design",
        "Warranty Support"
    ]',
    'https://images.unsplash.com/photo-1581092160607-ee37cfd58d03'),
    
(4, 'Home Energy Audit', 'Comprehensive energy efficiency assessment', 'Energy Audit', 'Residential', 299.99,
    '[
        "Thermal Imaging Analysis",
        "Air Leak Detection",
        "Insulation Assessment",
        "Energy Usage Analysis",
        "Detailed Report"
    ]',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866'),
    
(4, 'Solar System Maintenance', 'Regular maintenance and cleaning service', 'Maintenance', 'Solar Systems', 199.99,
    '[
        "Panel Cleaning",
        "System Inspection",
        "Performance Check",
        "Minor Repairs",
        "Annual Service Plan"
    ]',
    'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90');

-- Insert some additional products
INSERT INTO products (provider_id, name, description, category, subcategory, price, specifications, image_url) VALUES
(4, 'Premium Solar Kit', 'Complete solar power kit for homes', 'Solar Panels', 'Kits', 3999.99,
    '[
        "600W Total Power",
        "Includes Inverter",
        "Battery Backup",
        "Installation Kit",
        "Monitoring System"
    ]',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276'),
    
(4, 'Smart Battery Pack', 'Next-generation energy storage', 'Batteries', 'Smart Storage', 2499.99,
    '[
        "20kWh Capacity",
        "AI-powered Management",
        "Solar Integration",
        "Emergency Backup",
        "Smart Home Ready"
    ]',
    'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d');

-- Insert some additional services
INSERT INTO services (provider_id, name, description, category, subcategory, price, features, image_url) VALUES
(4, 'Commercial Solar Design', 'Custom solar solutions for businesses', 'Solar Installation', 'Commercial', 5999.99,
    '[
        "Custom System Design",
        "3D Modeling",
        "ROI Analysis",
        "Permit Management",
        "Project Management"
    ]',
    'https://images.unsplash.com/photo-1581092160607-ee37cfd58d03'),
    
(4, 'Emergency Maintenance', '24/7 emergency solar system repairs', 'Maintenance', 'Emergency', 399.99,
    '[
        "24/7 Availability",
        "Rapid Response",
        "Emergency Repairs",
        "System Diagnosis",
        "Temporary Solutions"
    ]',
    'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90'); 
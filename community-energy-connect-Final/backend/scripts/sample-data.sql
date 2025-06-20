-- Insert sample services with stock images
INSERT INTO services (name, description, category, image_url) VALUES
('Solar Panel Installation', 'Install solar panels to generate clean energy and reduce your electricity bills.', 'solar', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'),
('Home Energy Audits', 'Assess your home\'s energy efficiency and identify areas for improvement.', 'efficiency', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'),
('Smart Thermostat Installation', 'Control your home\'s temperature remotely and save energy with a smart thermostat.', 'efficiency', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80');

-- Insert sample providers with stock images
INSERT INTO service_providers (company_name, contact_name, phone_number, services, location, rating, description, image_url) VALUES
('Solar Solutions Inc.', 'John Smith', '555-0123', 'Solar panel installation, maintenance', 'Cityville', 4.5, 'Leading provider of solar panel installation and maintenance services.', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'),
('EcoHome Energy', 'Sarah Johnson', '555-0124', 'Energy audits, insulation, window upgrades', 'Townsville', 4.2, 'Specialists in energy-efficient home upgrades.', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'),
('Wind Power Now', 'Mike Davis', '555-0125', 'Wind turbine installation, solar solutions', 'Rural County', 4.8, 'Experts in residential wind turbine installations.', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80');

-- Insert sample workshops
INSERT INTO workshops (title, description, date, time, location) VALUES
('Solar Energy Basics', 'Learn the basics of renewable energy sources and their benefits.', '2024-03-15', '10:00:00', 'Community Center'),
('Home Energy Audits', 'Discover practical tips to improve your home\'s energy efficiency.', '2024-03-22', '14:00:00', 'Online'),
('Wind Power Fundamentals', 'Understanding wind energy and its applications.', '2024-03-29', '11:00:00', 'Library');

-- Insert sample articles with stock images
INSERT INTO articles (title, description, content, image_url, category) VALUES
('Insulating Your Home', 'A step-by-step guide to improving your home\'s insulation.', 'Complete guide content here...', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'efficiency'),
('Switching to LED Lighting', 'Learn about the benefits of LED lighting and how to install them.', 'Complete guide content here...', 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'efficiency'),
('Understanding Solar Panels', 'An overview of solar panel technology and its applications.', 'Complete guide content here...', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'solar'),
('Water Conservation Tips', 'Practical tips for reducing water usage and saving on your bills.', 'Complete guide content here...', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80', 'conservation');

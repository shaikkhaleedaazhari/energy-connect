-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2025 at 08:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `community_energy_connect`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `specifications` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `provider_id`, `name`, `description`, `price`, `specifications`, `category`, `subcategory`, `image_url`, `created_at`, `updated_at`) VALUES
(10, 2, 'Premium Solar Kit', 'Complete solar power kit for homes', 3999.99, '[\r\n        \"600W Total Power\",\r\n        \"Includes Inverter\",\r\n        \"Battery Backup\",\r\n        \"Installation Kit\",\r\n        \"Monitoring System\"\r\n    ]', 'Solar Panels', 'Kits', 'https://images.unsplash.com/photo-1509391366360-2e959784a276', '2025-06-08 11:13:38', '2025-06-08 11:13:38'),
(11, 3, 'Smart Battery Pack', 'Next-generation energy storage', 2499.99, '[\r\n        \"20kWh Capacity\",\r\n        \"AI-powered Management\",\r\n        \"Solar Integration\",\r\n        \"Emergency Backup\",\r\n        \"Smart Home Ready\"\r\n    ]', 'Energy Efficiency Appliances', 'Smart Storage', 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d', '2025-06-08 11:13:38', '2025-06-11 19:05:34'),
(12, 4, 'Solar Buckets', 'Hi This is the best product', 25.00, '[]', 'Home Energy Monitoring', 'Solar Panel Kits', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80', '2025-06-08 11:29:56', '2025-06-11 16:28:48'),
(13, 4, 'Solar Inverters', 'Inverter behind the solar panels. Renewable energy.', 35.00, '[\"Power Efficiency Designing\",\"Resisting harmonic wave\",\"Inductive load\",\"Safe and Stable\"]', 'Renewable Energy Equipment', 'Energy Usage Monitors', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYPYhwZ9VqyUjtx96zc26BUvAXKdEYa5eM-Q&s', '2025-06-08 12:05:04', '2025-06-11 17:10:21'),
(16, 13, '200W Solar Panel Kit', 'A plug-and-play solar kit for small homes and RVs.', 320.00, '[\"200W Polycrystalline Panel\",\"2V Inverter\",\"Charge Controller\",\"Mounting Brackets\"]', 'Renewable Energy Equipment', 'Solar Panel Kits', 'https://m.media-amazon.com/images/I/71dOi56tACL._AC_UF1000,1000_QL80_.jpg', '2025-06-11 18:54:03', '2025-06-11 19:02:16'),
(17, 13, '500W Wind Turbine Generator', 'All-weather turbine for small-scale wind energy.', 799.00, '[\"3 Blades, 500W output\",\"Max RPM: 800\",\"Aluminum Alloy Body\"]', 'Renewable Energy Equipment', 'Wind Turbines', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR4li24vRHc_6vUJ__4mNrCEznycrbY6o8pUaVVlxHguDLyB60BS7Ota7pQbqCxMNn84AbSYfkXVWwz6XzkeV8OtsJgIqNZjwvnR18qvOMgzkjBjFmlgnKcnw', '2025-06-11 18:56:00', '2025-06-12 06:11:02');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `features` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `provider_id`, `name`, `description`, `price`, `features`, `category`, `subcategory`, `image_url`, `created_at`, `updated_at`) VALUES
(42, 4, 'Solar Home Assessment', 'A detailed solar potential analysis of your home. Helps you make informed solar investment decisions.', 99.00, '[\"On-site inspection\",\"Roof shading analysis\",\"ROI report\"]', 'Solar Energy Services', 'Residential Solar Panel Installation', 'https://www.intermtnwindandsolar.com/wp-content/uploads/2024/04/Solar-Panel-Site-Assessments-EF.jpg', '2025-06-11 18:09:08', '2025-06-12 05:17:45'),
(43, 4, 'Energy Audit for Homes', 'We identify where your home wastes energy, suggest improvements.', 150.00, '[\"Full house audit\",\"Efficiency scoring\",\"Retrofit suggestions\"]', 'Energy Efficiency Services', 'Home Energy Audits', 'https://consumerenergyalliance.org/cms/wp-content/uploads/2017/05/household-energy-audit.jpg', '2025-06-11 18:11:04', '2025-06-12 05:17:07'),
(44, 13, 'Net Metering Consultation', 'Understand how to save money with solar net metering options.', 80.00, '[\"Tariff review\",\"Utility paperwork help\",\"ROI estimate\"]', 'Solar Energy Services', 'Community Solar Programs', 'https://www.sunshellpower.com/wp-content/uploads/2024/08/net-metering.jpg', '2025-06-11 18:15:03', '2025-06-11 19:01:01'),
(45, 13, 'LED Retrofit Service', 'Upgrade your entire home lighting to energy-saving LEDs.', 120.00, '[\"Installation\",\"Brand recommendations\",\"Energy savings report\"]', 'Energy Efficiency Services', 'Insulation and Weatherization', 'https://www.resoundenergy.com/wp-content/uploads/2021/11/shutterstock_612864767.jpg', '2025-06-11 18:17:54', '2025-06-11 19:00:39'),
(46, 13, 'Community Solar Setup', 'We guide neighborhood groups to set up shared solar power systems.', 500.00, '[\"Community planning\",\"Design\",\"Legal support\"]', 'Solar Energy Services', 'Community Solar Programs', 'https://images.ctfassets.net/gztkr1jaynk0/1XA1IMKj2X2jGSuCzuJwhf/88019ccf1b7208597a8105e8894f740b/what-is-community-solar.jpg', '2025-06-11 18:19:04', '2025-06-12 06:10:33'),
(47, 13, 'Youth Energy Awareness Camp', 'Interactive educational camp to teach school kids about renewable energy.', 49.99, '[\"Activities\",\"Mini solar projects\",\"Team games\"]', 'Educational Workshops', 'Renewable Energy Seminars', 'https://www.unicef.org/turkiye/sites/unicef.org.turkiye/files/styles/media_large_image/public/UNI651245.JPG.webp?itok=918LCPqv', '2025-06-11 18:20:39', '2025-06-12 06:10:07');

-- --------------------------------------------------------

--
-- Table structure for table `service_providers`
--

CREATE TABLE `service_providers` (
  `id` int(11) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `services` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_providers`
--

INSERT INTO `service_providers` (`id`, `company_name`, `contact_name`, `phone_number`, `location`, `description`, `services`, `created_at`, `updated_at`, `user_id`, `email`) VALUES
(1, 'Solar Solutions Inc.', 'John Smith', '555-0123', 'Cityville', 'Leading provider of solar panel installation and maintenance services.', 'Solar panel installation, maintenance', '2025-06-08 10:09:16', '2025-06-08 10:09:16', NULL, NULL),
(2, 'EcoHome Energy', 'Sarah Johnson', '555-0124', 'Townsville', 'Specialists in energy-efficient home upgrades.', 'Energy audits, insulation, window upgrades', '2025-06-08 10:09:16', '2025-06-08 10:09:16', NULL, NULL),
(3, 'Wind Power Now', 'Mike Davis', '555-0125', 'Rural County', 'Experts in residential wind turbine installations.', 'Wind turbine installation, solar solutions', '2025-06-08 10:09:16', '2025-06-08 10:09:16', NULL, NULL),
(4, 'Solar Power', 'Premsai K', '9866517596', 'Los Angels', 'Professional service provider in the city', 'General services', '2025-06-08 10:15:46', '2025-06-12 05:21:50', 5, 'ps@gmail.com'),
(13, 'Wind Energy', 'Arjun Sarkaar', '7989885508', 'New York', 'Professional service', 'All Services', '2025-06-10 04:34:55', '2025-06-12 06:11:55', 23, 'arjunwind@gmail.com'),
(14, 'Sun Machines', 'Shanmukh', '9866517596', 'Not specified', 'Professional service provider', 'General services', '2025-06-11 19:19:18', '2025-06-11 19:19:18', 25, 'shan@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('user','provider') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone_number` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `user_type`, `created_at`, `phone_number`) VALUES
(1, 'Pavan Kalyan', 'Budamacharla', 'pavan@gmail.com', '$2y$10$hGb2aFZdhxttG/fLj1hVoOc7ImrJpjYcn3mPJVz.oelN3OUGMTNwe', 'user', '2025-06-08 10:10:06', NULL),
(2, 'Premsai K', 'Kilaru', 'premsai@gmail.com', '$2y$10$aY1ZC8vEsWLbBG6UFBPuBuB/M2AeIjk9pdbcErJQ4lpM58uXML4V2', 'user', '2025-06-08 10:11:42', '7989885509'),
(5, 'Premsai K', '', 'ps@gmail.com', '$2y$10$RKadTfKW1yFB68AMbFShh./fcaDZ228K2ZLDtOHcfn/qLFaI1TLRW', 'provider', '2025-06-08 10:15:46', '9866517596'),
(6, 'John', 'Smith', 'john.smith@solarpower.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider', '2025-06-08 11:08:29', NULL),
(7, 'Emma', 'Wilson', 'emma.wilson@ecoenergy.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider', '2025-06-08 11:08:29', NULL),
(8, 'Michael', 'Brown', 'michael.brown@greenpower.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider', '2025-06-08 11:08:29', NULL),
(9, 'Sarah', 'Davis', 'sarah.davis@smartenergy.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider', '2025-06-08 11:08:29', NULL),
(22, 'vishhnu', 'saai', 'vishhnu@gmail.com', '$2y$10$G/pGNbTIBtpr5Pt1mCONduPvFYP0fT5stX.MUmgjF2iJKsus8s5/m', 'user', '2025-06-10 04:30:30', NULL),
(23, 'Arjun Sarkaar', '', 'arjunwind@gmail.com', '$2y$10$KYYpTAjB37yuBbLyW8KLKObpJq4EkRlx6DH1QUFtgXCag.dzJOFAm', 'provider', '2025-06-10 04:34:55', '7989885508'),
(24, 'Swami', 'C', 'swami@gmail.com', '$2y$10$rWSQ4NnF9VdJvPbqOq8MGed0/lb6B1cp07JdN9YLTBXtWwTunxiae', 'user', '2025-06-11 19:18:12', NULL),
(25, 'Shanmukh', '', 'shan@gmail.com', '$2y$10$Hy31b542xuVSjHFkznjt3eTFWezEdoda7rMhFtVKjmuRVARl7TWgC', 'provider', '2025-06-11 19:19:18', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `service_providers`
--
ALTER TABLE `service_providers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `service_providers`
--
ALTER TABLE `service_providers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `service_providers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `service_providers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_providers`
--
ALTER TABLE `service_providers`
  ADD CONSTRAINT `service_providers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

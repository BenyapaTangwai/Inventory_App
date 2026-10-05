-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 05, 2026 at 09:43 AM
-- Server version: 8.0.46-0ubuntu0.24.04.4
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ip_std6730202271`
--

-- --------------------------------------------------------

--
-- Table structure for table `Inventory`
--

CREATE TABLE `Inventory` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vp` int UNSIGNED NOT NULL DEFAULT '0',
  `price` int UNSIGNED NOT NULL DEFAULT '0',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Inventory`
--

INSERT INTO `Inventory` (`id`, `name`, `type`, `vp`, `price`, `image`, `stock`) VALUES
(1, 'Phaseguard Vandal', 'Vandal', 2475, 625, 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Phaseguard_Vandal.webp', 9),
(2, 'Reaver Vandal', 'Vandal', 1175, 500, 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Reaver_Vandal.webp', 2),
(3, 'CYRAX Vandal', 'Vandal', 2175, 625, 'https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/CYRAX_Vandal.webp', 6),
(4, 'Kuronami Vandal', 'Vandal', 2375, 625, 'https://static.wikia.nocookie.net/valorant/images/2/2e/Kuronami_Vandal.png/revision/latest?cb=20240109154323', 8),
(5, 'Neo Frontier  Phantom', 'Phantom', 2175, 625, 'https://media.valorant-api.com/weaponskinlevels/814fb822-4585-c9fe-85b4-bf8157646ae7/displayicon.png', 1),
(22, 'BlastX Polymer KnifeTech Coated Knife', 'Melee', 4350, 1134, 'https://static.wikia.nocookie.net/valorant/images/2/2a/BlastX_Polymer_KnifeTech_Coated_Knife.png/revision/latest?cb=20230711192950', 10);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PromptPay',
  `total_amount` decimal(10,2) NOT NULL,
  `total_vp` int DEFAULT '0',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Preparing Model',
  `items_json` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_number`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `payment_method`, `total_amount`, `total_vp`, `status`, `items_json`, `created_at`) VALUES
(1, 'VAL-0889576', 'Nin', 'mikukung19@gmail.com', NULL, 'Chonburi,Thailand', 'PromptPay', 1250.00, 4350, 'Completed', '[{\"id\":3,\"name\":\"CYRAX Vandal\",\"type\":\"Vandal\",\"vp\":2175,\"price\":625,\"quantity\":2,\"image_url\":\"https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/CYRAX_Vandal.webp\"}]', '2026-08-27 01:18:28'),
(2, 'VAL-5116045', 'Nyxpaszin', 'mikukung19@gmail.com', NULL, 'Chonburi,Thailand', 'PromptPay', 500.00, 1175, 'Cancelled', '[{\"id\":2,\"name\":\"Reaver Vandal\",\"type\":\"Vandal\",\"vp\":1175,\"price\":500,\"quantity\":1,\"image_url\":\"https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Reaver_Vandal.webp\"}]', '2026-08-27 01:19:11'),
(3, 'VAL-5907384', 'Bento', 'mikukung19@gmail.com', NULL, 'Chonburi,Thailand', 'TrueMoney', 5468.00, 654864, 'Shipping', '[{\"id\":16,\"name\":\"sdfsd\",\"type\":\"Ares\",\"vp\":654864,\"price\":5468,\"quantity\":1,\"image_url\":\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd0zN_DsLwGJh0wMEhpNAB53O8GBjCyBpAqYbjGRDRlubY2lnNvY7oE80&s=10\"}]', '2026-09-02 17:07:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `role`, `created_at`) VALUES
(1, 'Nyxpaszin', '@Bento2549', 'mikukung19@gmail.com', 'admin', '2026-08-26 14:28:24'),
(2, 'Bento', '@Bento2549', 'mikukung19@gmail.com', 'user', '2026-08-26 14:29:00'),
(5, 'Nyx', 'B123', 'bentokung.mada@gmail.com', 'user', '2026-08-26 16:52:47'),
(7, 'Nyx1', '@Bento', 'mikukung19@gmail.com', 'user', '2026-08-27 01:25:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Inventory`
--
ALTER TABLE `Inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Inventory`
--
ALTER TABLE `Inventory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

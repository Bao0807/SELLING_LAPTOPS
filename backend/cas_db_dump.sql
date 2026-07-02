-- CAS Laptop E-commerce Database Dump
-- Generated on 2026-06-15T16:38:44.116Z

CREATE DATABASE IF NOT EXISTS `cas_db`;
USE `cas_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------
-- Table structure for table `cartitems`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `cartitems`;
CREATE TABLE `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Table structure for table `categories`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `createdAt`, `updatedAt`) VALUES
  (1, 'Gaming Laptop', 'gaming', 'Laptop gaming hiệu năng cao', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (2, 'Laptop Văn Phòng', 'office', 'Laptop ổn định cho công việc', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (3, 'Laptop Sinh Viên', 'student', 'Laptop giá tốt dành cho sinh viên', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (4, 'Đồ Họa & Sáng Tạo', 'creative', 'Laptop màn hình đẹp cho thiết kế', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (5, 'MacBook', 'macbook', 'Apple MacBook các dòng', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (6, 'Ultrabook', 'ultrabook', 'Laptop mỏng nhẹ cao cấp', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (7, 'Workstation', 'workstation', 'Máy trạm di động hạng nặng', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (8, 'Laptop Doanh Nhân', 'business', 'Laptop bảo mật cao cho doanh nhân', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (9, '2-in-1 Laptop', '2-in-1', 'Laptop màn hình cảm ứng gập 360°', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (10, 'Laptop Cũ Giá Rẻ', 'refurbished', 'Laptop tân trang chất lượng', '2026-06-15 09:27:20', '2026-06-15 09:27:20');

-- ------------------------------------------------------
-- Table structure for table `orderitems`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `orderitems`;
CREATE TABLE `orderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_at_purchase` bigint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Table structure for table `orders`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` bigint NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `payment_method` varchar(255) NOT NULL,
  `shipping_address` text NOT NULL,
  `phone` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `voucher_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Table structure for table `productimages`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `productimages`;
CREATE TABLE `productimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Table structure for table `products`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `brand` varchar(255) DEFAULT NULL,
  `cpu` varchar(255) DEFAULT NULL,
  `ram` varchar(255) DEFAULT NULL,
  `storage` varchar(255) DEFAULT NULL,
  `gpu` varchar(255) DEFAULT NULL,
  `display` varchar(255) DEFAULT NULL,
  `battery` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `price` bigint NOT NULL,
  `discount_price` bigint DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `thumbnail` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `category_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `products`
INSERT INTO `products` (`id`, `name`, `slug`, `description`, `brand`, `cpu`, `ram`, `storage`, `gpu`, `display`, `battery`, `weight`, `price`, `discount_price`, `stock_quantity`, `thumbnail`, `is_featured`, `category_id`, `createdAt`, `updatedAt`) VALUES
  (1, 'ASUS Laptop Air 1', 'asus-laptop-air-1', 'Laptop ASUS phiên bản 1 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'ASUS', 'Intel Core i7-13700H', '16GB DDR5', '512GB NVMe SSD', 'NVIDIA RTX 4070', '15.6" FHD 144Hz', '60Wh', '1.3 kg', 11000000, 9500000, 11, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 1, 2, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (2, 'Dell Laptop Plus 2', 'dell-laptop-plus-2', 'Laptop Dell phiên bản 2 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Dell', 'Intel Core i9-13900H', '32GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 3060', '16" QHD 165Hz', '70Wh', '1.4 kg', 13000000, 11000000, 12, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 1, 3, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (3, 'HP Laptop Max 3', 'hp-laptop-max-3', 'Laptop HP phiên bản 3 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'HP', 'AMD Ryzen 5 7535HS', '16GB DDR4', '2TB NVMe SSD', 'NVIDIA RTX 4090', '14" 2.8K OLED 120Hz', '80Wh', '1.5 kg', 15000000, NULL, 13, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 1, 4, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (4, 'Lenovo Laptop Elite 4', 'lenovo-laptop-elite-4', 'Laptop Lenovo phiên bản 4 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Lenovo', 'AMD Ryzen 7 7745HX', '32GB DDR4', '256GB NVMe SSD', 'AMD Radeon RX 6700M', '13.6" Liquid Retina', '90Wh', '1.6 kg', 16000000, 13000000, 14, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 1, 5, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (5, 'Apple Laptop Ultra 5', 'apple-laptop-ultra-5', 'Laptop Apple phiên bản 5 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Apple', 'AMD Ryzen 9 7945HX', '64GB DDR5', '512GB NVMe SSD', 'Apple M2 GPU 10-core', '17.3" FHD 240Hz', '50Wh', '1.7 kg', 18000000, 17000000, 15, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 1, 6, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (6, 'MSI Laptop Pro 6', 'msi-laptop-pro-6', 'Laptop MSI phiên bản 6 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'MSI', 'Apple M2', '8GB DDR5', '1TB NVMe SSD', 'Intel Iris Xe', '14" FHD 144Hz IPS', '60Wh', '1.8 kg', 20000000, NULL, 16, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 1, 7, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (7, 'Acer Laptop Air 7', 'acer-laptop-air-7', 'Laptop Acer phiên bản 7 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Acer', 'Apple M2 Pro', '16GB DDR5', '2TB NVMe SSD', 'NVIDIA GeForce MX550', '15.6" FHD 144Hz', '70Wh', '1.9 kg', 21000000, 19000000, 17, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 1, 8, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (8, 'Samsung Laptop Plus 8', 'samsung-laptop-plus-8', 'Laptop Samsung phiên bản 8 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Samsung', 'Intel Core Ultra 7 155H', '32GB DDR5', '256GB NVMe SSD', 'NVIDIA RTX 4060', '16" QHD 165Hz', '80Wh', '2.0 kg', 23000000, 20500000, 18, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 1, 9, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (9, 'LG Laptop Max 9', 'lg-laptop-max-9', 'Laptop LG phiên bản 9 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'LG', 'Intel Core i5-1335U', '16GB DDR4', '512GB NVMe SSD', 'NVIDIA RTX 4070', '14" 2.8K OLED 120Hz', '90Wh', '2.1 kg', 25000000, NULL, 19, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 0, 10, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (10, 'Razer Laptop Elite 10', 'razer-laptop-elite-10', 'Laptop Razer phiên bản 10 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Razer', 'Intel Core i5-13500H', '32GB DDR4', '1TB NVMe SSD', 'NVIDIA RTX 3060', '13.6" Liquid Retina', '50Wh', '1.2 kg', 27000000, 26000000, 20, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 0, 1, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (11, 'ASUS Laptop Ultra 11', 'asus-laptop-ultra-11', 'Laptop ASUS phiên bản 11 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'ASUS', 'Intel Core i7-13700H', '64GB DDR5', '2TB NVMe SSD', 'NVIDIA RTX 4090', '17.3" FHD 240Hz', '60Wh', '1.3 kg', 28000000, 26500000, 21, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 0, 2, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (12, 'Dell Laptop Pro 12', 'dell-laptop-pro-12', 'Laptop Dell phiên bản 12 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Dell', 'Intel Core i9-13900H', '8GB DDR5', '256GB NVMe SSD', 'AMD Radeon RX 6700M', '14" FHD 144Hz IPS', '70Wh', '1.4 kg', 30000000, NULL, 22, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 0, 3, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (13, 'HP Laptop Air 13', 'hp-laptop-air-13', 'Laptop HP phiên bản 13 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'HP', 'AMD Ryzen 5 7535HS', '16GB DDR5', '512GB NVMe SSD', 'Apple M2 GPU 10-core', '15.6" FHD 144Hz', '80Wh', '1.5 kg', 32000000, 29500000, 23, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 0, 4, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (14, 'Lenovo Laptop Plus 14', 'lenovo-laptop-plus-14', 'Laptop Lenovo phiên bản 14 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Lenovo', 'AMD Ryzen 7 7745HX', '32GB DDR5', '1TB NVMe SSD', 'Intel Iris Xe', '16" QHD 165Hz', '90Wh', '1.6 kg', 33000000, 30000000, 24, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 0, 5, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (15, 'Apple Laptop Max 15', 'apple-laptop-max-15', 'Laptop Apple phiên bản 15 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Apple', 'AMD Ryzen 9 7945HX', '16GB DDR4', '2TB NVMe SSD', 'NVIDIA GeForce MX550', '14" 2.8K OLED 120Hz', '50Wh', '1.7 kg', 35000000, NULL, 25, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 0, 6, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (16, 'MSI Laptop Elite 16', 'msi-laptop-elite-16', 'Laptop MSI phiên bản 16 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'MSI', 'Apple M2', '32GB DDR4', '256GB NVMe SSD', 'NVIDIA RTX 4060', '13.6" Liquid Retina', '60Wh', '1.8 kg', 37000000, 35500000, 26, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 0, 7, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (17, 'Acer Laptop Ultra 17', 'acer-laptop-ultra-17', 'Laptop Acer phiên bản 17 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Acer', 'Apple M2 Pro', '64GB DDR5', '512GB NVMe SSD', 'NVIDIA RTX 4070', '17.3" FHD 240Hz', '70Wh', '1.9 kg', 38000000, 36000000, 27, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 0, 8, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (18, 'Samsung Laptop Pro 18', 'samsung-laptop-pro-18', 'Laptop Samsung phiên bản 18 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Samsung', 'Intel Core Ultra 7 155H', '8GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 3060', '14" FHD 144Hz IPS', '80Wh', '2.0 kg', 10000000, NULL, 28, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 0, 9, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (19, 'LG Laptop Air 19', 'lg-laptop-air-19', 'Laptop LG phiên bản 19 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'LG', 'Intel Core i5-1335U', '16GB DDR5', '2TB NVMe SSD', 'NVIDIA RTX 4090', '15.6" FHD 144Hz', '90Wh', '2.1 kg', 12000000, 9000000, 29, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 0, 10, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (20, 'Razer Laptop Plus 20', 'razer-laptop-plus-20', 'Laptop Razer phiên bản 20 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Razer', 'Intel Core i5-13500H', '32GB DDR5', '256GB NVMe SSD', 'AMD Radeon RX 6700M', '16" QHD 165Hz', '50Wh', '1.2 kg', 14000000, 13000000, 30, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 0, 1, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (21, 'ASUS Laptop Max 21', 'asus-laptop-max-21', 'Laptop ASUS phiên bản 21 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'ASUS', 'Intel Core i7-13700H', '16GB DDR4', '512GB NVMe SSD', 'Apple M2 GPU 10-core', '14" 2.8K OLED 120Hz', '60Wh', '1.3 kg', 15000000, NULL, 31, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 0, 2, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (22, 'Dell Laptop Elite 22', 'dell-laptop-elite-22', 'Laptop Dell phiên bản 22 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Dell', 'Intel Core i9-13900H', '32GB DDR4', '1TB NVMe SSD', 'Intel Iris Xe', '13.6" Liquid Retina', '70Wh', '1.4 kg', 17000000, 15000000, 32, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 0, 3, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (23, 'HP Laptop Ultra 23', 'hp-laptop-ultra-23', 'Laptop HP phiên bản 23 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'HP', 'AMD Ryzen 5 7535HS', '64GB DDR5', '2TB NVMe SSD', 'NVIDIA GeForce MX550', '17.3" FHD 240Hz', '80Wh', '1.5 kg', 19000000, 16500000, 33, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 0, 4, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (24, 'Lenovo Laptop Pro 24', 'lenovo-laptop-pro-24', 'Laptop Lenovo phiên bản 24 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Lenovo', 'AMD Ryzen 7 7745HX', '8GB DDR5', '256GB NVMe SSD', 'NVIDIA RTX 4060', '14" FHD 144Hz IPS', '90Wh', '1.6 kg', 20000000, NULL, 34, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 0, 5, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (25, 'Apple Laptop Air 25', 'apple-laptop-air-25', 'Laptop Apple phiên bản 25 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Apple', 'AMD Ryzen 9 7945HX', '16GB DDR5', '512GB NVMe SSD', 'NVIDIA RTX 4070', '15.6" FHD 144Hz', '50Wh', '1.7 kg', 22000000, 21000000, 35, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 0, 6, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (26, 'MSI Laptop Plus 26', 'msi-laptop-plus-26', 'Laptop MSI phiên bản 26 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'MSI', 'Apple M2', '32GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 3060', '16" QHD 165Hz', '60Wh', '1.8 kg', 24000000, 22500000, 36, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 0, 7, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (27, 'Acer Laptop Max 27', 'acer-laptop-max-27', 'Laptop Acer phiên bản 27 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Acer', 'Apple M2 Pro', '16GB DDR4', '2TB NVMe SSD', 'NVIDIA RTX 4090', '14" 2.8K OLED 120Hz', '70Wh', '1.9 kg', 25000000, NULL, 37, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 0, 8, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (28, 'Samsung Laptop Elite 28', 'samsung-laptop-elite-28', 'Laptop Samsung phiên bản 28 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Samsung', 'Intel Core Ultra 7 155H', '32GB DDR4', '256GB NVMe SSD', 'AMD Radeon RX 6700M', '13.6" Liquid Retina', '80Wh', '2.0 kg', 27000000, 24500000, 38, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 0, 9, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (29, 'LG Laptop Ultra 29', 'lg-laptop-ultra-29', 'Laptop LG phiên bản 29 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'LG', 'Intel Core i5-1335U', '64GB DDR5', '512GB NVMe SSD', 'Apple M2 GPU 10-core', '17.3" FHD 240Hz', '90Wh', '2.1 kg', 29000000, 26000000, 39, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 0, 10, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (30, 'Razer Laptop Pro 30', 'razer-laptop-pro-30', 'Laptop Razer phiên bản 30 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Razer', 'Intel Core i5-13500H', '8GB DDR5', '1TB NVMe SSD', 'Intel Iris Xe', '14" FHD 144Hz IPS', '50Wh', '1.2 kg', 31000000, NULL, 40, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 0, 1, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (31, 'ASUS Laptop Air 31', 'asus-laptop-air-31', 'Laptop ASUS phiên bản 31 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'ASUS', 'Intel Core i7-13700H', '16GB DDR5', '2TB NVMe SSD', 'NVIDIA GeForce MX550', '15.6" FHD 144Hz', '60Wh', '1.3 kg', 32000000, 30500000, 41, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 0, 2, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (32, 'Dell Laptop Plus 32', 'dell-laptop-plus-32', 'Laptop Dell phiên bản 32 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Dell', 'Intel Core i9-13900H', '32GB DDR5', '256GB NVMe SSD', 'NVIDIA RTX 4060', '16" QHD 165Hz', '70Wh', '1.4 kg', 34000000, 32000000, 42, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 0, 3, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (33, 'HP Laptop Max 33', 'hp-laptop-max-33', 'Laptop HP phiên bản 33 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'HP', 'AMD Ryzen 5 7535HS', '16GB DDR4', '512GB NVMe SSD', 'NVIDIA RTX 4070', '14" 2.8K OLED 120Hz', '80Wh', '1.5 kg', 36000000, NULL, 43, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 0, 4, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (34, 'Lenovo Laptop Elite 34', 'lenovo-laptop-elite-34', 'Laptop Lenovo phiên bản 34 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Lenovo', 'AMD Ryzen 7 7745HX', '32GB DDR4', '1TB NVMe SSD', 'NVIDIA RTX 3060', '13.6" Liquid Retina', '90Wh', '1.6 kg', 37000000, 34000000, 44, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 0, 5, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (35, 'Apple Laptop Ultra 35', 'apple-laptop-ultra-35', 'Laptop Apple phiên bản 35 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Apple', 'AMD Ryzen 9 7945HX', '64GB DDR5', '2TB NVMe SSD', 'NVIDIA RTX 4090', '17.3" FHD 240Hz', '50Wh', '1.7 kg', 39000000, 38000000, 45, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 0, 6, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (36, 'MSI Laptop Pro 36', 'msi-laptop-pro-36', 'Laptop MSI phiên bản 36 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'MSI', 'Apple M2', '8GB DDR5', '256GB NVMe SSD', 'AMD Radeon RX 6700M', '14" FHD 144Hz IPS', '60Wh', '1.8 kg', 11000000, NULL, 46, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 0, 7, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (37, 'Acer Laptop Air 37', 'acer-laptop-air-37', 'Laptop Acer phiên bản 37 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Acer', 'Apple M2 Pro', '16GB DDR5', '512GB NVMe SSD', 'Apple M2 GPU 10-core', '15.6" FHD 144Hz', '70Wh', '1.9 kg', 12000000, 10000000, 47, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 0, 8, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (38, 'Samsung Laptop Plus 38', 'samsung-laptop-plus-38', 'Laptop Samsung phiên bản 38 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Samsung', 'Intel Core Ultra 7 155H', '32GB DDR5', '1TB NVMe SSD', 'Intel Iris Xe', '16" QHD 165Hz', '80Wh', '2.0 kg', 14000000, 11500000, 48, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 0, 9, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (39, 'LG Laptop Max 39', 'lg-laptop-max-39', 'Laptop LG phiên bản 39 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'LG', 'Intel Core i5-1335U', '16GB DDR4', '2TB NVMe SSD', 'NVIDIA GeForce MX550', '14" 2.8K OLED 120Hz', '90Wh', '2.1 kg', 16000000, NULL, 49, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 0, 10, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (40, 'Razer Laptop Elite 40', 'razer-laptop-elite-40', 'Laptop Razer phiên bản 40 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Razer', 'Intel Core i5-13500H', '32GB DDR4', '256GB NVMe SSD', 'NVIDIA RTX 4060', '13.6" Liquid Retina', '50Wh', '1.2 kg', 18000000, 17000000, 10, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 0, 1, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (41, 'ASUS Laptop Ultra 41', 'asus-laptop-ultra-41', 'Laptop ASUS phiên bản 41 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'ASUS', 'Intel Core i7-13700H', '64GB DDR5', '512GB NVMe SSD', 'NVIDIA RTX 4070', '17.3" FHD 240Hz', '60Wh', '1.3 kg', 19000000, 17500000, 11, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 0, 2, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (42, 'Dell Laptop Pro 42', 'dell-laptop-pro-42', 'Laptop Dell phiên bản 42 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Dell', 'Intel Core i9-13900H', '8GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 3060', '14" FHD 144Hz IPS', '70Wh', '1.4 kg', 21000000, NULL, 12, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 0, 3, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (43, 'HP Laptop Air 43', 'hp-laptop-air-43', 'Laptop HP phiên bản 43 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'HP', 'AMD Ryzen 5 7535HS', '16GB DDR5', '2TB NVMe SSD', 'NVIDIA RTX 4090', '15.6" FHD 144Hz', '80Wh', '1.5 kg', 23000000, 20500000, 13, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 0, 4, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (44, 'Lenovo Laptop Plus 44', 'lenovo-laptop-plus-44', 'Laptop Lenovo phiên bản 44 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Lenovo', 'AMD Ryzen 7 7745HX', '32GB DDR5', '256GB NVMe SSD', 'AMD Radeon RX 6700M', '16" QHD 165Hz', '90Wh', '1.6 kg', 24000000, 21000000, 14, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 0, 5, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (45, 'Apple Laptop Max 45', 'apple-laptop-max-45', 'Laptop Apple phiên bản 45 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Apple', 'AMD Ryzen 9 7945HX', '16GB DDR4', '512GB NVMe SSD', 'Apple M2 GPU 10-core', '14" 2.8K OLED 120Hz', '50Wh', '1.7 kg', 26000000, NULL, 15, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80', 0, 6, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (46, 'MSI Laptop Elite 46', 'msi-laptop-elite-46', 'Laptop MSI phiên bản 46 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'MSI', 'Apple M2', '32GB DDR4', '1TB NVMe SSD', 'Intel Iris Xe', '13.6" Liquid Retina', '60Wh', '1.8 kg', 28000000, 26500000, 16, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', 0, 7, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (47, 'Acer Laptop Ultra 47', 'acer-laptop-ultra-47', 'Laptop Acer phiên bản 47 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Acer', 'Apple M2 Pro', '64GB DDR5', '2TB NVMe SSD', 'NVIDIA GeForce MX550', '17.3" FHD 240Hz', '70Wh', '1.9 kg', 29000000, 27000000, 17, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80', 0, 8, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (48, 'Samsung Laptop Pro 48', 'samsung-laptop-pro-48', 'Laptop Samsung phiên bản 48 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Samsung', 'Intel Core Ultra 7 155H', '8GB DDR5', '256GB NVMe SSD', 'NVIDIA RTX 4060', '14" FHD 144Hz IPS', '80Wh', '2.0 kg', 31000000, NULL, 18, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', 0, 9, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (49, 'LG Laptop Air 49', 'lg-laptop-air-49', 'Laptop LG phiên bản 49 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'LG', 'Intel Core i5-1335U', '16GB DDR5', '512GB NVMe SSD', 'NVIDIA RTX 4070', '15.6" FHD 144Hz', '90Wh', '2.1 kg', 33000000, 30000000, 19, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80', 0, 10, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (50, 'Razer Laptop Plus 50', 'razer-laptop-plus-50', 'Laptop Razer phiên bản 50 với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.', 'Razer', 'Intel Core i5-13500H', '32GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 3060', '16" QHD 165Hz', '50Wh', '1.2 kg', 35000000, 34000000, 20, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', 0, 1, '2026-06-15 09:27:20', '2026-06-15 09:27:20');

-- ------------------------------------------------------
-- Table structure for table `reviews`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Table structure for table `sequelizemeta`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Dumping data for table `sequelizemeta`
INSERT INTO `sequelizemeta` (`name`) VALUES
  ('20260613062758-create-voucher.js'),
  ('20260613062759-create-category.js'),
  ('20260613062759-create-user.js'),
  ('20260613062800-create-product.js'),
  ('20260613062801-create-product-image.js'),
  ('20260613062802-create-cart-item.js'),
  ('20260613062802-create-wishlist-item.js'),
  ('20260613062803-create-order.js'),
  ('20260613062804-create-order-item.js'),
  ('20260613062805-create-voucher-usage.js'),
  ('20260613062806-create-review.js');

-- ------------------------------------------------------
-- Table structure for table `users`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'customer',
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `avatar`, `createdAt`, `updatedAt`) VALUES
  (1, 'Admin CAS', 'admin@cas.vn', '0900000000', '$2b$10$3irdj3atcsLJcKHzvvz8WO9Dc09ZXF6t9p3q7lwZZvNI6X2CXj8..', 'admin', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (2, 'Nguyễn Văn An', 'customer1@cas.vn', '09012345678', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (3, 'Trần Thị Bình', 'customer2@cas.vn', '09012345679', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (4, 'Lê Minh Châu', 'customer3@cas.vn', '09012345680', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (5, 'Phạm Thị Dung', 'customer4@cas.vn', '09012345681', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (6, 'Hoàng Văn Em', 'customer5@cas.vn', '09012345682', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (7, 'Đỗ Thị Phương', 'customer6@cas.vn', '09012345683', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (8, 'Vũ Minh Quân', 'customer7@cas.vn', '09012345684', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (9, 'Bùi Thị Hoa', 'customer8@cas.vn', '09012345685', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (10, 'Đặng Văn Khôi', 'customer9@cas.vn', '09012345686', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (11, 'Ngô Thị Lan', 'customer10@cas.vn', '09012345687', '$2b$10$HRcbS5nJyq4G/Twi4mTK/urJyt987ULo4tecKoRmSzY4kmMr4UNSu', 'customer', NULL, '2026-06-15 09:27:20', '2026-06-15 09:27:20');

-- ------------------------------------------------------
-- Table structure for table `vouchers`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `discount_type` varchar(255) NOT NULL,
  `discount_value` int NOT NULL,
  `minimum_order_amount` int DEFAULT '0',
  `usage_limit` int DEFAULT '0',
  `used_count` int DEFAULT '0',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` varchar(255) DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `vouchers`
INSERT INTO `vouchers` (`id`, `code`, `discount_type`, `discount_value`, `minimum_order_amount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `status`, `createdAt`, `updatedAt`) VALUES
  (1, 'WELCOME10', 'percent', 10, 5000000, 100, 0, '2025-12-31 17:00:00', '2027-12-30 17:00:00', 'active', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (2, 'CAS500K', 'fixed', 500000, 10000000, 50, 0, '2025-12-31 17:00:00', '2027-12-30 17:00:00', 'active', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (3, 'SUMMER15', 'percent', 15, 15000000, 30, 0, '2025-12-31 17:00:00', '2027-12-30 17:00:00', 'active', '2026-06-15 09:27:20', '2026-06-15 09:27:20'),
  (4, 'FLASH2M', 'fixed', 2000000, 20000000, 10, 0, '2025-12-31 17:00:00', '2027-12-30 17:00:00', 'active', '2026-06-15 09:27:20', '2026-06-15 09:27:20');

-- ------------------------------------------------------
-- Table structure for table `voucherusages`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `voucherusages`;
CREATE TABLE `voucherusages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `voucher_id` int NOT NULL,
  `order_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `voucherusages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `voucherusages_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `voucherusages_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------
-- Table structure for table `wishlistitems`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `wishlistitems`;
CREATE TABLE `wishlistitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlistitems_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wishlistitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;

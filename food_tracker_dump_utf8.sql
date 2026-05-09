-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: gondola.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` enum('╤И╤В.','╨║╨│','╨╗') NOT NULL DEFAULT '╤И╤В.',
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `min_quantity` decimal(10,2) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_176b502c5ebd6e72cafbd9d6f70` (`user_id`),
  CONSTRAINT `FK_176b502c5ebd6e72cafbd9d6f70` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (22,20,'1','╨║╨│',7.00,1.00,NULL,'2026-04-22 19:11:54.910841'),(23,20,'2','╤И╤В.',4.00,2.00,NULL,'2026-04-22 19:12:03.949305'),(24,20,'3','╤И╤В.',1.00,3.00,NULL,'2026-04-22 19:12:10.697804'),(26,21,'╤Б╨╜╤Г╤Б╨╝╤Г╨╝╤А╨╕╨║╨╕','╤И╤В.',1.00,1.00,'https://res.cloudinary.com/dp6hfo8d2/image/upload/v1777496103/food-tracker/afkaaw3v7v6emzwkt1ur.jpg','2026-04-29 20:53:51.513677'),(27,21,'╨║╨▓╨╡╤А╤Е╨╛╨┐╤Г╨╖╨╕╨║╨╕','╤И╤В.',34.00,NULL,'https://res.cloudinary.com/dp6hfo8d2/image/upload/v1777496416/food-tracker/lefzya5426o2sda4ksap.jpg','2026-04-29 20:57:41.175221');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_transactions`
--

DROP TABLE IF EXISTS `stock_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('purchase','expense','adjustment') NOT NULL,
  `quantity_delta` decimal(10,2) NOT NULL,
  `quantity_after` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_76393785410b1df65a9b38a714e` (`product_id`),
  KEY `FK_07476234b775566efbb13338403` (`user_id`),
  CONSTRAINT `FK_07476234b775566efbb13338403` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_76393785410b1df65a9b38a714e` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_transactions`
--

LOCK TABLES `stock_transactions` WRITE;
/*!40000 ALTER TABLE `stock_transactions` DISABLE KEYS */;
INSERT INTO `stock_transactions` VALUES (2,22,20,'purchase',1.00,2.00,1.00,NULL,'2026-04-23 10:42:39.554532'),(3,22,20,'expense',-1.00,1.00,1.00,NULL,'2026-04-23 10:42:53.122278'),(4,23,20,'purchase',3.00,5.00,1.00,NULL,'2026-04-23 10:44:17.672101'),(5,23,20,'expense',-4.00,1.00,NULL,NULL,'2026-04-23 10:44:29.549000'),(6,23,20,'purchase',2.00,3.00,NULL,NULL,'2026-04-23 10:44:45.741946'),(7,22,20,'purchase',1.00,2.00,NULL,NULL,'2026-04-23 11:16:02.795155'),(8,22,20,'purchase',1.00,3.00,1.00,NULL,'2026-04-25 09:54:47.678615'),(9,23,20,'purchase',2.00,5.00,2.00,NULL,'2026-04-25 09:55:00.702533'),(10,24,20,'expense',-3.00,0.00,NULL,NULL,'2026-04-25 09:55:14.442791'),(11,22,20,'purchase',1.00,4.00,NULL,NULL,'2026-04-25 10:05:28.339744'),(12,23,20,'expense',-1.00,4.00,NULL,NULL,'2026-04-25 10:05:44.431120'),(13,22,20,'purchase',1.00,5.00,1.00,NULL,'2026-04-25 10:11:26.805117'),(14,22,20,'purchase',1.00,6.00,1.00,NULL,'2026-04-25 10:15:30.484109'),(15,22,20,'purchase',1.00,7.00,1.00,NULL,'2026-04-25 10:18:20.718680'),(16,24,20,'purchase',1.00,1.00,1.00,NULL,'2026-04-25 10:19:11.419803'),(22,27,21,'purchase',1.00,2.00,0.01,NULL,'2026-04-29 20:58:48.010533'),(23,27,21,'expense',-1.00,1.00,NULL,NULL,'2026-04-29 20:59:13.785648'),(24,27,21,'purchase',33.00,34.00,NULL,NULL,'2026-04-29 20:59:40.481768');
/*!40000 ALTER TABLE `stock_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `currency` enum('ILS','EUR','USD','RUB') NOT NULL DEFAULT 'ILS',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'vokileze@gmail.com','$2b$10$mDTzQowUsGeVvVlF3iTmv.cpafyHFQpdNsGgCVQqfQFluEyUvbf2O','2026-03-30 20:45:40.007085','RUB'),(20,'ezelikov@mail.ru','$2b$10$gULmNxIN9KavzSHaj.KDlOZGySrnCRd3hyiXm88qIflXFeYx.drva','2026-04-21 10:09:29.760841','ILS'),(21,'escaped111@gmail.com','$2b$10$3pzvWTDVtd5qOS7y.D3NTOb.jn6qo4/COiSKFw9MiPaeObP/ldh2m','2026-04-29 20:50:34.315344','EUR');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09 22:40:38

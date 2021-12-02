CREATE DATABASE  IF NOT EXISTS `auction` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 */;
USE `auction`;
-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: auction
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `automation`
--

DROP TABLE IF EXISTS `automation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `automation` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `user` int(11) NOT NULL,
                              `offer` float NOT NULL,
                              `product` int(11) NOT NULL,
                              PRIMARY KEY (`id`),
                              KEY `automation-user_idx` (`user`),
                              KEY `automation-product_idx` (`product`),
                              CONSTRAINT `automation-product` FOREIGN KEY (`product`) REFERENCES `product` (`id`),
                              CONSTRAINT `automation-user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `automation`
--

LOCK TABLES `automation` WRITE;
/*!40000 ALTER TABLE `automation` DISABLE KEYS */;
INSERT INTO `automation` VALUES (23,12,64,18),(28,12,30,18),(29,12,72,18),(30,3,65,18),(35,3,90,18),(36,3,85,18),(37,3,95,18),(38,12,90,18),(39,12,105,18),(40,3,104,18),(41,12,120,18),(44,3,150,18),(45,12,122,18),(46,3,125,18),(47,12,144,18),(48,3,300,32),(49,12,150,32),(50,12,170,32);
/*!40000 ALTER TABLE `automation` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `automation_AFTER_INSERT` AFTER INSERT ON `automation` FOR EACH ROW BEGIN
    declare user int;
    declare increment int;
    declare offer float;
    declare current float;
    set user = (select product.holder from product where product.id = new.product);
    if(user <> new.user) then
        begin
            set user = (select automation.user from automation where automation.user <> new.user and automation.product = new.product and automation.offer > new.offer order by automation.offer desc limit 1);
            set increment = (select product.increment from product where product.id = new.product);
            if (user) then
                begin
                    insert into history(user, offer, product) values(new.user, new.offer, new.product);
                    call UpdateHistory(new.user,new.product,new.offer);
                end;
            else
                begin
                    set current = (select product.current from product where product.id = new.product);
                    set offer = (select automation.offer from automation where automation.user <> new.user and automation.product = new.product and automation.offer >= current order by automation.offer limit 1);
                    if (offer) then
                        insert into history(user, offer, product) values(new.user, offer + increment, new.product);
                        call UpdateHistory(new.user,new.product,offer + increment);
                    else
                        insert into history(user, offer, product) values(new.user, current + increment, new.product);
                        call UpdateHistory(new.user,new.product,current + increment);
                    end if;
                end;
            end if;
        end;
    end if;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
                            `id` int(11) NOT NULL AUTO_INCREMENT,
                            `name` varchar(45) DEFAULT NULL,
                            `parent` int(11) DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `category-category_idx` (`parent`),
                            CONSTRAINT `category-category` FOREIGN KEY (`parent`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Continent',NULL),(2,'Ocean',NULL),(3,'Sky',NULL),(4,'Space',NULL),(5,'Plain',1),(6,'Mountain',1),(7,'Valley',1),(8,'Forest',1),(9,'Surface Ocean',2),(10,'Deep Ocean',2),(11,'Seafloor Sediments',2),(12,'Troposphere',3),(13,'Stratosphere',3),(14,'Mesosphere',3),(15,'Thermosphere',3),(16,'Exosphere',3),(17,'Star',4),(18,'Galaxy',4),(19,'Cosmos',4),(20,'Universe',4);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `user` int(11) NOT NULL,
                           `offer` float NOT NULL,
                           `product` int(11) NOT NULL,
                           `time` datetime DEFAULT CURRENT_TIMESTAMP,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES (1,12,103,32,'2020-01-08 23:11:49'),(2,12,105,32,'2020-01-08 23:16:37'),(3,12,54,18,'2020-01-08 23:34:44'),(4,12,55,18,'2020-01-08 23:34:48'),(5,12,56,18,'2020-01-08 23:34:54'),(6,12,57,18,'2020-01-08 23:35:36'),(7,12,59,18,'2020-01-08 23:35:43'),(8,12,60,18,'2020-01-08 23:35:52'),(9,12,64,18,'2020-01-09 00:13:19'),(10,12,10,18,'2020-01-09 00:22:07'),(11,12,10,18,'2020-01-09 00:27:50'),(12,12,11,18,'2020-01-09 00:33:45'),(13,12,18,18,'2020-01-09 00:34:49'),(14,12,66,18,'2020-01-09 00:45:59'),(15,3,73,18,'2020-01-09 01:19:51'),(16,3,91,18,'2020-01-09 01:24:22'),(17,12,96,18,'2020-01-09 01:28:40'),(18,12,100,18,'2020-01-09 01:29:54'),(19,3,104,18,'2020-01-09 01:34:59'),(20,12,105,18,'2020-01-09 01:35:53'),(21,3,108,18,'2020-01-09 01:36:23'),(23,3,110,18,'2020-01-09 01:40:37'),(27,3,111,18,'2020-01-09 01:55:15'),(30,12,122,18,'2020-01-09 02:30:55'),(31,3,123,18,'2020-01-09 02:33:20'),(32,12,144,18,'2020-01-09 02:34:05'),(33,3,145,18,'2020-01-09 02:34:05'),(34,12,146,18,'2020-01-09 02:34:49'),(36,12,147,18,'2020-01-09 02:38:25'),(37,3,148,18,'2020-01-09 02:38:25'),(38,12,147,18,'2020-01-09 02:38:51'),(39,3,148,18,'2020-01-09 02:38:51'),(40,3,106,32,'2020-01-09 02:44:55'),(41,12,110,32,'2020-01-09 02:45:26'),(42,3,111,32,'2020-01-09 02:45:26'),(43,12,150,32,'2020-01-09 02:45:40'),(44,3,151,32,'2020-01-09 02:45:40'),(45,12,112,32,'2020-01-09 02:55:08'),(46,3,113,32,'2020-01-09 02:55:08'),(47,12,111,32,'2020-01-09 02:55:16'),(48,3,112,32,'2020-01-09 02:55:16'),(49,12,11,32,'2020-01-09 02:55:19'),(50,3,12,32,'2020-01-09 02:55:19'),(51,12,11,32,'2020-01-09 02:55:22'),(52,3,12,32,'2020-01-09 02:55:22'),(53,12,152,32,'2020-01-09 02:56:08'),(54,3,153,32,'2020-01-09 02:56:08'),(55,12,156,32,'2020-01-09 02:56:21'),(57,12,158,32,'2020-01-09 02:56:47'),(59,12,162,32,'2020-01-09 03:01:28'),(61,12,7,17,'2020-01-09 03:03:01'),(62,12,102,17,'2020-01-09 03:03:48'),(63,12,11,17,'2020-01-09 03:53:35'),(64,12,1,28,'2020-01-09 07:30:28'),(65,12,1,28,'2020-01-09 07:30:31'),(66,12,2,28,'2020-01-09 07:30:34'),(67,12,3,28,'2020-01-09 07:30:37'),(68,12,24,28,'2020-01-09 07:31:02'),(69,12,25,28,'2020-01-09 07:38:09'),(70,12,26,28,'2020-01-09 07:40:32'),(71,12,28,28,'2020-01-09 07:41:15'),(72,12,29,28,'2020-01-09 07:43:40'),(73,12,31,28,'2020-01-09 07:45:49'),(74,12,32,28,'2020-01-09 07:53:39'),(75,12,33,28,'2020-01-09 07:54:39'),(76,12,34,28,'2020-01-09 07:56:25'),(77,12,35,28,'2020-01-09 08:01:40'),(78,12,36,28,'2020-01-09 08:02:58'),(79,12,37,28,'2020-01-09 08:10:13'),(80,12,38,28,'2020-01-09 08:18:41'),(81,12,39,28,'2020-01-09 08:24:51'),(82,12,40,28,'2020-01-09 08:38:55'),(83,12,500,21,'2020-01-09 16:21:59'),(84,12,152,18,'2020-01-09 17:10:17'),(85,12,70,31,'2020-01-09 17:11:04');
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `history_AFTER_INSERT` AFTER INSERT ON `history` FOR EACH ROW BEGIN
    declare current float;
    set current = (select product.current from product where product.id = new.product);
    if(new.offer > current) then
        update product set product.holder = new.user, product.current = new.offer where product.id=new.product;
    end if;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `image` longtext NOT NULL,
                         `product` int(11) NOT NULL,
                         PRIMARY KEY (`id`),
                         KEY `image-product_idx` (`product`),
                         CONSTRAINT `image-product` FOREIGN KEY (`product`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (1,'/assets/img/crying.png',1),(2,'/assets/img/crying.png',1),(3,'/assets/img/crying.png',1),(4,'/assets/img/crying.png',2),(5,'/assets/img/crying.png',2),(6,'/assets/img/crying.png',2),(7,'/assets/img/crying.png',3),(8,'/assets/img/crying.png',3),(9,'/assets/img/crying.png',3),(10,'/assets/img/crying.png',4),(11,'/assets/img/crying.png',4),(12,'/assets/img/crying.png',4),(13,'/assets/img/crying.png',5),(14,'/assets/img/crying.png',5),(15,'/assets/img/crying.png',5),(16,'/assets/img/crying.png',6),(17,'/assets/img/crying.png',6),(18,'/assets/img/crying.png',6),(19,'/assets/img/crying.png',7),(20,'/assets/img/crying.png',7),(21,'/assets/img/crying.png',7),(22,'/assets/img/crying.png',8),(23,'/assets/img/crying.png',8),(24,'/assets/img/crying.png',8),(25,'/assets/img/crying.png',9),(26,'/assets/img/crying.png',9),(27,'/assets/img/crying.png',9),(28,'/assets/img/crying.png',10),(29,'/assets/img/crying.png',10),(30,'/assets/img/crying.png',10),(31,'/assets/img/crying.png',11),(32,'/assets/img/crying.png',11),(33,'/assets/img/crying.png',11),(34,'/assets/img/crying.png',12),(35,'/assets/img/crying.png',12),(36,'/assets/img/crying.png',12),(37,'/assets/img/crying.png',13),(38,'/assets/img/crying.png',13),(39,'/assets/img/crying.png',13),(40,'/assets/img/crying.png',14),(41,'/assets/img/crying.png',14),(42,'/assets/img/crying.png',14),(43,'/assets/img/crying.png',15),(44,'/assets/img/crying.png',15),(45,'/assets/img/crying.png',15),(46,'/assets/img/crying.png',16),(47,'/assets/img/crying.png',16),(48,'/assets/img/crying.png',16),(49,'/assets/img/crying.png',17),(50,'/assets/img/crying.png',17),(51,'/assets/img/crying.png',17),(52,'/assets/img/crying.png',18),(53,'/assets/img/crying.png',18),(54,'/assets/img/crying.png',18),(55,'/assets/img/crying.png',19),(56,'/assets/img/crying.png',19),(57,'/assets/img/crying.png',19),(58,'/assets/img/crying.png',20),(59,'/assets/img/crying.png',20),(60,'/assets/img/crying.png',20),(61,'/assets/img/crying.png',21),(62,'/assets/img/crying.png',21),(63,'/assets/img/crying.png',21),(64,'/assets/img/crying.png',22),(65,'/assets/img/crying.png',22),(66,'/assets/img/crying.png',22),(67,'/assets/img/crying.png',23),(68,'/assets/img/crying.png',23),(69,'/assets/img/crying.png',23),(70,'/assets/img/crying.png',24),(71,'/assets/img/crying.png',24),(72,'/assets/img/crying.png',24),(73,'/assets/img/crying.png',25),(74,'/assets/img/crying.png',25),(75,'/assets/img/crying.png',25),(76,'/assets/img/crying.png',26),(77,'/assets/img/crying.png',26),(78,'/assets/img/crying.png',26),(79,'/assets/img/crying.png',27),(80,'/assets/img/crying.png',27),(81,'/assets/img/crying.png',27),(82,'/assets/img/crying.png',28),(83,'/assets/img/crying.png',28),(84,'/assets/img/crying.png',28),(85,'/assets/img/crying.png',29),(86,'/assets/img/crying.png',29),(87,'/assets/img/crying.png',29),(88,'/assets/img/crying.png',30),(89,'/assets/img/crying.png',30),(90,'/assets/img/crying.png',30),(91,'/assets/img/crying.png',31),(92,'/assets/img/crying.png',31),(93,'/assets/img/crying.png',31),(94,'/assets/img/crying.png',32),(95,'/assets/img/crying.png',32),(96,'/assets/img/crying.png',32),(97,'/assets/img/crying.png',33),(98,'/assets/img/crying.png',33),(99,'/assets/img/crying.png',33),(100,'/assets/img/crying.png',34),(101,'/assets/img/crying.png',34),(102,'/assets/img/crying.png',34),(103,'/assets/img/crying.png',35),(104,'/assets/img/crying.png',35),(105,'/assets/img/crying.png',35),(106,'/assets/img/crying.png',36),(107,'/assets/img/crying.png',36),(108,'/assets/img/crying.png',36),(109,'/assets/img/crying.png',37),(110,'/assets/img/crying.png',37),(111,'/assets/img/crying.png',37),(112,'/assets/img/crying.png',38),(113,'/assets/img/crying.png',38),(114,'/assets/img/crying.png',38),(115,'/assets/img/crying.png',17),(116,'/assets/img/crying.png',17);
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp` (
                       `id` int(11) NOT NULL AUTO_INCREMENT,
                       `start` datetime DEFAULT CURRENT_TIMESTAMP,
                       `end` datetime DEFAULT NULL,
                       `email` varchar(100) NOT NULL,
                       `otp` varchar(6) NOT NULL,
                       PRIMARY KEY (`id`),
                       KEY `otp-user_idx` (`email`),
                       CONSTRAINT `otp-user` FOREIGN KEY (`email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp`
--

LOCK TABLES `otp` WRITE;
/*!40000 ALTER TABLE `otp` DISABLE KEYS */;
INSERT INTO `otp` VALUES (2,'2020-01-08 17:40:52','2020-01-08 17:41:52','fourthzerd@gmail.com','389798'),(3,'2020-01-08 17:55:11','2020-01-08 18:10:11','fourthzerd@gmail.com','736408'),(4,'2020-01-08 18:02:20','2020-01-08 18:17:20','fourthzerd@gmail.com','894357'),(5,'2020-01-08 18:05:17','2020-01-08 18:20:17','fourthzerd@gmail.com','846180'),(6,'2020-01-08 18:06:44','2020-01-08 18:21:44','fourthzerd@gmail.com','567845'),(7,'2020-01-08 18:08:54','2020-01-08 18:23:54','fourthzerd@gmail.com','209367'),(8,'2020-01-08 18:10:58','2020-01-08 18:25:58','fourthzerd@gmail.com','835066'),(9,'2020-01-08 23:04:48','2020-01-08 23:19:48','fourthzerd@gmail.com','181402'),(10,'2020-01-09 01:22:53','2020-01-09 01:37:53','fourthzerd@gmail.com','557301'),(11,'2020-01-09 02:43:58','2020-01-09 02:58:58','fourthzerd@gmail.com','508907'),(12,'2020-01-09 03:52:28','2020-01-09 04:07:28','fourthzerd@gmail.com','732621'),(13,'2020-01-09 04:00:55','2020-01-09 04:15:55','fourthzerd@gmail.com','263040'),(14,'2020-01-09 04:33:52','2020-01-09 04:48:52','fourthzerd@gmail.com','833209'),(15,'2020-01-09 05:38:10','2020-01-09 05:53:10','fourthzerd@gmail.com','267001'),(16,'2020-01-09 05:40:11','2020-01-09 05:55:11','fourthzerd@gmail.com','276979'),(17,'2020-01-09 05:45:09','2020-01-09 06:00:09','fourthzerd@gmail.com','676537'),(18,'2020-01-09 06:04:38','2020-01-09 06:19:38','fourthzerd@gmail.com','138923'),(19,'2020-01-09 06:32:31','2020-01-09 06:47:31','fourthzerd@gmail.com','403734'),(20,'2020-01-09 07:36:27','2020-01-09 07:51:27','fourthzerd@gmail.com','795048'),(21,'2020-01-09 16:20:41','2020-01-09 16:35:41','fourthzerd@gmail.com','411315'),(22,'2020-01-09 17:08:24','2020-01-09 17:23:24','fourthzerd@gmail.com','701312'),(23,'2020-01-09 20:58:54','2020-01-09 21:13:54','fourthzerd@gmail.com','891223'),(24,'2020-01-09 21:11:26','2020-01-09 21:26:26','derekzohar@gmail.com','887868'),(25,'2020-01-09 21:12:41','2020-01-09 21:27:41','lena@gmail.com','817086');
/*!40000 ALTER TABLE `otp` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `otp_BEFORE_INSERT` BEFORE INSERT ON `otp` FOR EACH ROW BEGIN
    set new.end = new.start + interval 15 minute;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `name` varchar(45) NOT NULL,
                           `seller` int(11) NOT NULL,
                           `start` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           `end` datetime NOT NULL,
                           `cap` float unsigned NOT NULL,
                           `current` float unsigned NOT NULL DEFAULT '0',
                           `increment` float DEFAULT '0',
                           `holder` int(11) DEFAULT NULL,
                           `info` varchar(45) DEFAULT NULL,
                           `bids` int(10) unsigned NOT NULL DEFAULT '0',
                           `description` longtext,
                           `category` int(11) DEFAULT NULL,
                           `image` longtext NOT NULL,
                           `status` varchar(45) DEFAULT NULL,
                           `annoucement`  varchar(300) DEFAULT NULL,
                           PRIMARY KEY (`id`),
                           KEY `product-seller_idx` (`seller`),
                           KEY `product-holder_idx` (`holder`,`info`),
                           KEY `product-category_idx` (`category`),
                           FULLTEXT KEY `name` (`name`,`description`),
                           CONSTRAINT `product-category` FOREIGN KEY (`category`) REFERENCES `category` (`id`),
                           CONSTRAINT `product-seller` FOREIGN KEY (`seller`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;

/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `product_AFTER_UPDATE` BEFORE UPDATE ON `product` FOR EACH ROW BEGIN
    IF new.end < old.start THEN
        BEGIN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Invalid end date!';
        END;
    END IF;
    IF (old.status = new.status and old.status <> 'bidding') THEN
        BEGIN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Bidding expires!';
        END;
    END IF;
    IF new.current >= old.cap THEN
        BEGIN
            set new.current = old.cap;
            set new.status = 'sold';
        END;
    END IF;
    set new.info = (select name from user where user.id = new.holder);
    set new.bids = (select count(*) from history where history.product=new.id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
                            `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
                            `expires` int(11) unsigned NOT NULL,
                            `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
                            PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('aWFoc4uJJbi3PUjHM-XWDGg6AfWW1bRE',1578584856,'{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2020-01-09T14:58:50.917Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"authenticated\":true,\"user\":{\"id\":3,\"name\":\"Lena\",\"email\":\"lena@gmail.com\",\"privilege\":\"admin\",\"rating\":8.3}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
                        `id` int(11) NOT NULL AUTO_INCREMENT,
                        `name` varchar(100) NOT NULL,
                        `email` varchar(100) NOT NULL,
                        `password` varchar(255) NOT NULL,
                        `privilege` varchar(45) DEFAULT NULL,
                        `rating` float DEFAULT NULL,
                        `request` varchar(15) DEFAULT NULL,
                        `address` nvarchar(100) DEFAULT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--
LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Erod Nelps','erodnelps@gmail.com','$2a$10$PFlKvjXDXnF9xkgFCn8XEu02WSlIswunEqCPm6r9sjwweniDPTc/y','bidder',8.3, NULL,NULL),(2,'Derek Zohar','derekzohar@gmail.com','$2a$10$HLXCmxXJAziwS5I0RUIgSeyF4FgIedu4hoKtQZR1AN6z/M9qCv/L.','seller',8.2,NULL,NULL),(3,'Lena','lena@gmail.com','$2a$10$jZUexXSHXxLEKJQOT1yUD.1DR8v9LIE1JaXJaCXzA.j/0yAQqvIyO','admin',8.3,NULL,NULL),(12,'Zerd','fourthzerd@gmail.com','$2a$10$4nKjydizzQ4CqAT5Krm1MOIPSJdBAD1.YDRWzCa0PkJeYmW9E973C','bidder',8.2,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping events for database 'auction'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `Refresh_Product` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `e_store_ts` ON SCHEDULE EVERY 1 HOUR STARTS '2020-01-09 21:44:10' ON COMPLETION NOT PRESERVE ENABLE DO call Refresh() */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'auction'
--
/*!50003 DROP PROCEDURE IF EXISTS `Refresh` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Refresh`()
BEGIN
    update product set status = 'sold' where end < now() and status = 'bidding' and bids > 0;
    update product set status = 'expired' where end < now() and status = 'bidding' and bids = 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateHistory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateHistory`(user int, product int, offer float)
BEGIN
    declare host int;
    set host = (select automation.user from automation where automation.user <> user and automation.product= product and automation.offer > offer order by automation.offer desc limit 1);
    if(host) then
        begin
            declare increment float;
            set increment = (select product.increment from product where product.id=product);
            insert into history (user, offer, product) values (host, offer + increment, product);
        end;
    end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


DROP TABLE IF EXISTS `watchlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchlist` (
                             `user` int(11) NOT NULL AUTO_INCREMENT,
                             `product` int(11) DEFAULT NULL,
                             KEY `fk_watchlist_user_idx` (`user`),
                             KEY `fk_watchlist_product_idx` (`product`),
                             CONSTRAINT `fk_watchlist_product` FOREIGN KEY (`product`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
                             CONSTRAINT `fk_watchlist_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `watchlist`
--

--
-- Dumping events for database 'auction'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-09 22:01:00

-- MySQL dump 10.13  Distrib 8.0.21, for macos10.15 (x86_64)
--
-- Host: localhost    Database: ChildAdvocacyOLTP
-- ------------------------------------------------------
-- Server version	8.0.21

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
-- Table structure for table `AccessControl`
--

DROP TABLE IF EXISTS `AccessControl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccessControl` (
  `AccessControlKey` int NOT NULL AUTO_INCREMENT,
  `IsApproved` tinyint NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `EmailAddress` varchar(255) NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  `Secret` varchar(100) NOT NULL,
  `Token` varchar(100) DEFAULT NULL,
  `TokenExpirationTm` datetime DEFAULT NULL,
  `SecretExpirationTm` datetime NOT NULL,
  `Carrier` varchar(45) NOT NULL,
  `mfCode` int DEFAULT NULL,
  `mfCodeExpirationTm` datetime DEFAULT NULL,
  `mfToken` varchar(100) DEFAULT NULL,
  `IsAdmin` tinyint NOT NULL,
  `EffectiveThru` datetime DEFAULT NULL,
  `ForgotPWRequested` tinyint DEFAULT NULL,
  PRIMARY KEY (`AccessControlKey`),
  UNIQUE KEY `idAccessControl_UNIQUE` (`AccessControlKey`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Case`
--

DROP TABLE IF EXISTS `Case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Case` (
  `CaseKey` int NOT NULL AUTO_INCREMENT,
  `cdKeyCaseType` int NOT NULL,
  PRIMARY KEY (`CaseKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Case_File`
--

DROP TABLE IF EXISTS `Case_File`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Case_File` (
  `Case_FileKey` int NOT NULL AUTO_INCREMENT,
  `CaseKey` int NOT NULL,
  `FileKey` int DEFAULT NULL,
  PRIMARY KEY (`Case_FileKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Case_Person`
--

DROP TABLE IF EXISTS `Case_Person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Case_Person` (
  `Case_PersonKey` int NOT NULL,
  `CaseKey` int NOT NULL,
  `PersonKey` int NOT NULL,
  `cdKeyPersonRole` int NOT NULL,
  PRIMARY KEY (`Case_PersonKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ChildEvent`
--

DROP TABLE IF EXISTS `ChildEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChildEvent` (
  `ChildEventKey` int NOT NULL AUTO_INCREMENT,
  `CaseKey` int NOT NULL,
  `accKeyInterviewer` int NOT NULL,
  `EventType` varchar(100) NOT NULL,
  `Location` varchar(100) NOT NULL,
  `EventStartDateTm` datetime NOT NULL,
  `EventEndDateTm` datetime DEFAULT NULL,
  PRIMARY KEY (`ChildEventKey`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CodeDef`
--

DROP TABLE IF EXISTS `CodeDef`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CodeDef` (
  `CodeDefKey` int NOT NULL,
  `cdCategory` varchar(45) NOT NULL,
  `cdCode` varchar(45) NOT NULL,
  PRIMARY KEY (`CodeDefKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `File`
--

DROP TABLE IF EXISTS `File`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `File` (
  `FileKey` int NOT NULL AUTO_INCREMENT,
  `cdKeyFileType` int NOT NULL,
  `FileName` varchar(100) NOT NULL,
  `AzureId` varchar(100) NOT NULL,
  PRIMARY KEY (`FileKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Person`
--

DROP TABLE IF EXISTS `Person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Person` (
  `PersonKey` int NOT NULL,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `BirthDate` date DEFAULT NULL,
  `NameMnemonic` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`PersonKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-28 17:22:46

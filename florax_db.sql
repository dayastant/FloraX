-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 23, 2026 at 10:45 AM
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
-- Database: `florax_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `alert_id` bigint(20) NOT NULL,
  `alert_type` enum('DRY_SOIL','LOW_WATER','SENSOR_FAULT') DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `status` enum('ACTIVE','RESOLVED') DEFAULT NULL,
  `garden_id` bigint(20) DEFAULT NULL,
  `zone_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gardens`
--

CREATE TABLE `gardens` (
  `garden_id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `garden_name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `total_area` double DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `irrigation_logs`
--

CREATE TABLE `irrigation_logs` (
  `log_id` bigint(20) NOT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `trigger_type` enum('AUTO','MANUAL') DEFAULT NULL,
  `water_volume_used` double DEFAULT NULL,
  `valve_id` bigint(20) DEFAULT NULL,
  `zone_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pumps`
--

CREATE TABLE `pumps` (
  `pump_id` bigint(20) NOT NULL,
  `last_activated_at` datetime(6) DEFAULT NULL,
  `status` enum('OFF','ON') DEFAULT NULL,
  `tank_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensors`
--

CREATE TABLE `sensors` (
  `sensor_id` bigint(20) NOT NULL,
  `installation_date` date DEFAULT NULL,
  `sensor_type` enum('HUMIDITY','MOISTURE','TEMPERATURE') DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','FAULTY','INACTIVE') DEFAULT NULL,
  `zone_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensor_readings`
--

CREATE TABLE `sensor_readings` (
  `reading_id` bigint(20) NOT NULL,
  `recorded_at` datetime(6) DEFAULT NULL,
  `value` double DEFAULT NULL,
  `sensor_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','TECHNICIAN','USER') DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `valves`
--

CREATE TABLE `valves` (
  `valve_id` bigint(20) NOT NULL,
  `last_activated_at` datetime(6) DEFAULT NULL,
  `power_source` enum('BATTERY','SOLAR') DEFAULT NULL,
  `valve_status` enum('CLOSED','OPEN') DEFAULT NULL,
  `zone_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `water_level_readings`
--

CREATE TABLE `water_level_readings` (
  `reading_id` bigint(20) NOT NULL,
  `recorded_at` datetime(6) DEFAULT NULL,
  `water_level` double DEFAULT NULL,
  `tank_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `water_tanks`
--

CREATE TABLE `water_tanks` (
  `tank_id` bigint(20) NOT NULL,
  `capacity_liters` double DEFAULT NULL,
  `current_level_liters` double DEFAULT NULL,
  `status` enum('EMPTY','LOW','NORMAL') DEFAULT NULL,
  `garden_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `zone_id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `moisture_threshold_max` double DEFAULT NULL,
  `moisture_threshold_min` double DEFAULT NULL,
  `plant_type` varchar(255) DEFAULT NULL,
  `soil_type` varchar(255) DEFAULT NULL,
  `sunlight_exposure` enum('HIGH','LOW','MEDIUM') DEFAULT NULL,
  `zone_name` varchar(255) DEFAULT NULL,
  `garden_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `FK3lq8291uckwxsn6fcjqpfyp4h` (`garden_id`),
  ADD KEY `FKdd6jar16qt4328fukx1ew3xp` (`zone_id`);

--
-- Indexes for table `gardens`
--
ALTER TABLE `gardens`
  ADD PRIMARY KEY (`garden_id`),
  ADD KEY `FKf5ejdmdy30on4c9i4an99phgc` (`user_id`);

--
-- Indexes for table `irrigation_logs`
--
ALTER TABLE `irrigation_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `FKo3ah68grql4asql47pjsw5yrs` (`valve_id`),
  ADD KEY `FK1sxh9xpibhogydtvpdqdg6t6d` (`zone_id`);

--
-- Indexes for table `pumps`
--
ALTER TABLE `pumps`
  ADD PRIMARY KEY (`pump_id`),
  ADD KEY `FKe63fxul5l0uiub00d6pn6nlb5` (`tank_id`);

--
-- Indexes for table `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`sensor_id`),
  ADD KEY `FKjkil8gjcqvmrukveg25u3kr7d` (`zone_id`);

--
-- Indexes for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD PRIMARY KEY (`reading_id`),
  ADD KEY `FKd4ige1wwwq10mktsgk89fx30d` (`sensor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- Indexes for table `valves`
--
ALTER TABLE `valves`
  ADD PRIMARY KEY (`valve_id`),
  ADD KEY `FK2yg7vcg1nijfd1qnxojeqgxw8` (`zone_id`);

--
-- Indexes for table `water_level_readings`
--
ALTER TABLE `water_level_readings`
  ADD PRIMARY KEY (`reading_id`),
  ADD KEY `FKyk0upb9t3cvfyog2p7tbrppe` (`tank_id`);

--
-- Indexes for table `water_tanks`
--
ALTER TABLE `water_tanks`
  ADD PRIMARY KEY (`tank_id`),
  ADD KEY `FKmaxq6sft4aypgvvm21whoitfd` (`garden_id`);

--
-- Indexes for table `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`zone_id`),
  ADD KEY `FKgk9e10puaxb37oa91qi1odwfd` (`garden_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gardens`
--
ALTER TABLE `gardens`
  MODIFY `garden_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `irrigation_logs`
--
ALTER TABLE `irrigation_logs`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pumps`
--
ALTER TABLE `pumps`
  MODIFY `pump_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sensors`
--
ALTER TABLE `sensors`
  MODIFY `sensor_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  MODIFY `reading_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `valves`
--
ALTER TABLE `valves`
  MODIFY `valve_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `water_level_readings`
--
ALTER TABLE `water_level_readings`
  MODIFY `reading_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `water_tanks`
--
ALTER TABLE `water_tanks`
  MODIFY `tank_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `zone_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `FK3lq8291uckwxsn6fcjqpfyp4h` FOREIGN KEY (`garden_id`) REFERENCES `gardens` (`garden_id`),
  ADD CONSTRAINT `FKdd6jar16qt4328fukx1ew3xp` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`zone_id`);

--
-- Constraints for table `gardens`
--
ALTER TABLE `gardens`
  ADD CONSTRAINT `FKf5ejdmdy30on4c9i4an99phgc` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `irrigation_logs`
--
ALTER TABLE `irrigation_logs`
  ADD CONSTRAINT `FK1sxh9xpibhogydtvpdqdg6t6d` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`zone_id`),
  ADD CONSTRAINT `FKo3ah68grql4asql47pjsw5yrs` FOREIGN KEY (`valve_id`) REFERENCES `valves` (`valve_id`);

--
-- Constraints for table `pumps`
--
ALTER TABLE `pumps`
  ADD CONSTRAINT `FKe63fxul5l0uiub00d6pn6nlb5` FOREIGN KEY (`tank_id`) REFERENCES `water_tanks` (`tank_id`);

--
-- Constraints for table `sensors`
--
ALTER TABLE `sensors`
  ADD CONSTRAINT `FKjkil8gjcqvmrukveg25u3kr7d` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`zone_id`);

--
-- Constraints for table `sensor_readings`
--
ALTER TABLE `sensor_readings`
  ADD CONSTRAINT `FKd4ige1wwwq10mktsgk89fx30d` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`sensor_id`);

--
-- Constraints for table `valves`
--
ALTER TABLE `valves`
  ADD CONSTRAINT `FK2yg7vcg1nijfd1qnxojeqgxw8` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`zone_id`);

--
-- Constraints for table `water_level_readings`
--
ALTER TABLE `water_level_readings`
  ADD CONSTRAINT `FKyk0upb9t3cvfyog2p7tbrppe` FOREIGN KEY (`tank_id`) REFERENCES `water_tanks` (`tank_id`);

--
-- Constraints for table `water_tanks`
--
ALTER TABLE `water_tanks`
  ADD CONSTRAINT `FKmaxq6sft4aypgvvm21whoitfd` FOREIGN KEY (`garden_id`) REFERENCES `gardens` (`garden_id`);

--
-- Constraints for table `zones`
--
ALTER TABLE `zones`
  ADD CONSTRAINT `FKgk9e10puaxb37oa91qi1odwfd` FOREIGN KEY (`garden_id`) REFERENCES `gardens` (`garden_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

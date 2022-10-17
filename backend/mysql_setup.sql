-- create database db
CREATE DATABASE db;

-- use newly create database
USE db;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `displayname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` boolean NOT NULL DEFAULT false,
  `saved_posts` mediumtext NOT NULL,
  `liked_posts` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`)
);



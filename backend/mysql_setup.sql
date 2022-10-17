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

CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `author` bigint unsigned NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `body` varchar(150) NOT NULL,
  `liked_by` mediumtext NOT NULL,
  `reposted_by` mediumtext NOT NULL,
  `is_pinned` boolean NOT NULL DEFAULT false,
  `edited` boolean NOT NULL DEFAULT false,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  FOREIGN KEY (`author`) REFERENCES `users` (`id`)
);

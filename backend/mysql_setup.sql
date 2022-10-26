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
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `author` bigint unsigned NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `body` varchar(150) NOT NULL,
  `is_pinned` boolean NOT NULL DEFAULT false,
  `edited` boolean NOT NULL DEFAULT false,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  FOREIGN KEY (`author`) REFERENCES `users` (`id`)
);

CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent` bigint unsigned NOT NULL,
  `author` bigint unsigned NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `body` varchar(150) NOT NULL,
  `is_pinned` boolean NOT NULL DEFAULT false,
  `edited` boolean NOT NULL DEFAULT false,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  FOREIGN KEY (`author`) REFERENCES `users` (`id`),
  FOREIGN KEY (`parent`) REFERENCES `posts` (`id`) ON DELETE CASCADE
);

CREATE TABLE `likes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post` bigint unsigned NOT NULL,
  `user` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  FOREIGN KEY (`post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user`) REFERENCES `users` (`id`)
);

CREATE TABLE `reposts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post` bigint unsigned NOT NULL,
  `user` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  FOREIGN KEY (`post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user`) REFERENCES `users` (`id`)
);

CREATE TABLE `follows` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `src` bigint unsigned NOT NULL,
  `dst` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  FOREIGN KEY (`src`) REFERENCES `users` (`id`),
  FOREIGN KEY (`dst`) REFERENCES `users` (`id`)
);

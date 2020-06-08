CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(100) DEFAULT NULL,
  `apikey` varchar(36) NOT NULL DEFAULT '',
  UNIQUE KEY `apikey` (`apikey`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Users';

CREATE TABLE IF NOT EXISTS `push` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(50) NOT NULL,
  `path` varchar(250) NOT NULL,
  `mime` varchar(250) NOT NULL,
  `owner` int(11) NOT NULL DEFAULT 0,
  UNIQUE KEY `url` (`url`),
  KEY `id` (`id`) USING BTREE,
  KEY `FK__users` (`owner`),
  CONSTRAINT `FK__users` FOREIGN KEY (`owner`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='push';

-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-08-21 23:02:48
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `wa6`
--

-- --------------------------------------------------------

--
-- 表的结构 `wa6_users`
--

CREATE TABLE IF NOT EXISTS `wa6_users` (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `nickname` varchar(32) NOT NULL DEFAULT '' COMMENT '昵称',
  `realname` varchar(16) NOT NULL DEFAULT '' COMMENT '真实姓名',
  `gender` int(1) NOT NULL DEFAULT '0' COMMENT '性别：0保密 1男 2女',
  `phone` char(11) NOT NULL DEFAULT '',
  `wechat` char(16) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `open_id` char(64) NOT NULL DEFAULT '',
  `state` char(3) NOT NULL DEFAULT '100' COMMENT '账号状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `open_id` (`open_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

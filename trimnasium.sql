create database trimnasium;
create user 'admin'@'localhost' identified by 'password';
create table categories (id int unsigned primary key, name varchar(64), color int unsigned);

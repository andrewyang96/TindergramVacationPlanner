DROP DATABASE tgvp;

CREATE DATABASE tgvp;
CREATE TABLE tgvp.credentials (platform VARCHAR UNIQUE, client_id VARCHAR, client_secret VARCHAR);
CREATE TABLE tgvp.cities (city_name VARCHAR UNIQUE, currency VARCHAR, lat DECIMAL, lng DECIMAL, placeholder_image VARCHAR, rating DECIMAL DEFAULT 1500);

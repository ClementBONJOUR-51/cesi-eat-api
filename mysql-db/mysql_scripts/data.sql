USE cesi;

CREATE TABLE `Users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(20) NOT NULL,
    `lastname` VARCHAR(20) NOT NULL,
    `gender` VARCHAR(20) NOT NULL,
    `birthday` DATE NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `token` VARCHAR(100),
    `phone` VARCHAR(20) NOT NULL,
    `date_in` DATE NOT NULL DEFAULT (CURRENT_DATE),
    `date_out` DATE,
    `id_sponsor` INT,
    `id_role` INT NOT NULL,
    `id_address` INT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `Address` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`postal_code` VARCHAR(20) NOT NULL,
	`street` VARCHAR(50) NOT NULL,
	`city` VARCHAR(20) NOT NULL,
	`street_number` INT NOT NULL,
	`lati` FLOAT,
	`longi` FLOAT,
    `date_in` DATE NOT NULL DEFAULT (CURRENT_DATE),
    `date_out` DATE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Roles` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`customer` BOOLEAN NOT NULL DEFAULT false,
    `delivery_person` BOOLEAN NOT NULL DEFAULT false,
    `restorant` BOOLEAN NOT NULL DEFAULT false,
    `administrator` BOOLEAN NOT NULL DEFAULT false,
    `sales_department` BOOLEAN NOT NULL DEFAULT false,
    `technical_department` BOOLEAN NOT NULL DEFAULT false,
    `developer_tier` BOOLEAN NOT NULL DEFAULT false,
    `date_in` DATE NOT NULL DEFAULT (CURRENT_DATE),
    `date_out` DATE,
	PRIMARY KEY (`id`)
);

-- Insertion des données dans la table Roles
INSERT INTO Roles (customer, delivery_person, restorant, administrator, sales_department, technical_department, developer_tier)
VALUES (true, false, false, false, false, false, false);

INSERT INTO Roles (customer, delivery_person, restorant, administrator, sales_department, technical_department, developer_tier)
VALUES (false, true, false, false, false, false, false);

INSERT INTO Roles (customer, delivery_person, restorant, administrator, sales_department, technical_department, developer_tier)
VALUES (false, false, true, false, false, false, false);

INSERT INTO Roles (customer, delivery_person, restorant, administrator, sales_department, technical_department, developer_tier)
VALUES (false, false, false, true, false, false, false);

-- Insertion des données dans la table Address
INSERT INTO Address (postal_code, street, city, street_number, lati, longi)
VALUES ('12345', 'Main Street', 'Cityville', 10, 40.1234, -74.5678);

INSERT INTO Address (postal_code, street, city, street_number, lati, longi)
VALUES ('98765', 'Oak Avenue', 'Townsville', 25, 41.5678, -73.1234);

INSERT INTO Address (postal_code, street, city, street_number, lati, longi)
VALUES ('54321', 'Elm Road', 'Villageville', 5, 39.8765, -75.4321);

INSERT INTO Address (postal_code, street, city, street_number, lati, longi)
VALUES ('67890', 'Cedar Lane', 'Hamletville', 15, 40.4321, -74.8765);

-- Insertion des données dans la table Users
INSERT INTO Users (firstname, lastname, gender, birthday, email, password, token, phone, id_role, id_address)
VALUES ('John', 'Doe', 'Male', '1990-05-15', 'john.doe@example.com', 'password123', 'token123', '1234567890', 1, 1);

INSERT INTO Users (firstname, lastname, gender, birthday, email, password, token, phone, id_role, id_address)
VALUES ('Jane', 'Smith', 'Female', '1985-09-20', 'jane.smith@example.com', 'password456', 'token456', '9876543210', 2, 2);

INSERT INTO Users (firstname, lastname, gender, birthday, email, password, token, phone, id_role, id_address)
VALUES ('Michael', 'Johnson', 'Male', '1995-02-10', 'michael.johnson@example.com', 'password789', 'token789', '5555555555', 3, 3);

INSERT INTO Users (firstname, lastname, gender, birthday, email, password, token, phone, id_role, id_address)
VALUES ('Emily', 'Davis', 'Female', '1998-11-28', 'emily.davis@example.com', 'passwordabc', 'tokenabc', '9999999999', 4, 4);

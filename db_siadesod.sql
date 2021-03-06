CREATE DATABASE `SIADESOD`;
USE `SIADESOD`;

CREATE TABLE `USER` (
`ID_USER` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`PASSWORD` VARCHAR (16) NOT NULL,
`FIRST_NAME` VARCHAR (45) NOT NULL,
`LAST_NAME` VARCHAR (45) NOT NULL,
`EMAIL` VARCHAR (45) NOT NULL,
`DATE_OF_BIRTH` DATE NOT NULL,
`PHONE` VARCHAR (10),
`ADDRESS` VARCHAR (150),
`GENDER` ENUM ('MALE', 'FEMALE'),
`TYPE` ENUM ('PATIENT', 'STAFF', 'DENTIST'),
`ADMIN` TINYINT (1),
PRIMARY KEY (`ID_USER`),
UNIQUE (`EMAIL`)
);

CREATE TABLE `STAFF` (
`ID_STAFF` INT UNSIGNED NOT NULL,
`SALARY` INT NOT NULL,
`TYPE` ENUM ('ADMINISTRATIVE', 'INTENDANCE'),
PRIMARY KEY (`ID_STAFF`),
CONSTRAINT `fk_STAFF_USER` FOREIGN KEY (`ID_STAFF`) REFERENCES `USER` (`ID_USER`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE `PATIENT` (
`ID_PATIENT` INT UNSIGNED NOT NULL,
`CURP` VARCHAR (18) NOT NULL,
`INSURANCES` VARCHAR (45),
`ALLERGIES` VARCHAR (200),
PRIMARY KEY (`ID_PATIENT`),
UNIQUE (`CURP`),
CONSTRAINT `fk_PATIENT_USER` FOREIGN KEY (`ID_PATIENT`) REFERENCES `USER` (`ID_USER`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE `DENTIST` (
`ID_DENTIST` INT UNSIGNED NOT NULL,
`RATE` INT NOT NULL,
`CEDULA` VARCHAR (45),
`SPECIALITY` VARCHAR (45),
PRIMARY KEY (`ID_DENTIST`),
UNIQUE (`CEDULA`),
CONSTRAINT `fk_DENTIST_USER` FOREIGN KEY (`ID_DENTIST`) REFERENCES `USER` (`ID_USER`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE `APPOINTMENT` (
`ID_APPOINTMENT` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`ID_PATIENT` INT UNSIGNED NOT NULL,
`ID_DENTIST` INT UNSIGNED NOT NULL,
`DATE` DATE NOT NULL,
`STATUS` ENUM ('PENDING', 'CANCELED', 'DONE') NOT NULL DEFAULT 'PENDING',
`DESCRIPTION` VARCHAR (150) DEFAULT 'NINGUNO',
PRIMARY KEY (`ID_APPOINTMENT`),
INDEX `fk_APPOINTMENT_PATIENT_idx` (`ID_PATIENT`),
INDEX `fk_APPOINTMENT_DENTIST_idx` (`ID_DENTIST`),
CONSTRAINT `fk_APPOINTMENT_PATIENT` FOREIGN KEY (`ID_PATIENT`) REFERENCES `PATIENT` (`ID_PATIENT`) ON DELETE NO ACTION ON UPDATE NO ACTION,
CONSTRAINT `fk_APPOINTMENT_DENTIST` FOREIGN KEY (`ID_DENTIST`) REFERENCES `DENTIST` (`ID_DENTIST`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `TREATMENT` (
`ID_TREATMENT` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`ID_APPOINTMENT` INT UNSIGNED NOT NULL,
`START_DATE` DATE NOT NULL,
`END_DATE` DATE NOT NULL,
`MEDICAL_DIAGNOSTIC` VARCHAR (100) NOT NULL,
`MEDICINE` VARCHAR (45) DEFAULT 'NO REQUIERE MEDICAMENTO',
`OBSERVATION` VARCHAR (100) DEFAULT 'NINGUNO',
PRIMARY KEY (`ID_TREATMENT`),
INDEX `fk_TREATMENT_APPOINTMENT_idx` (`ID_APPOINTMENT`),
CONSTRAINT `fk_TREATMENT_APPOINTMENT` FOREIGN KEY (`ID_APPOINTMENT`) REFERENCES `APPOINTMENT` (`ID_APPOINTMENT`) ON DELETE CASCADE ON UPDATE NO ACTION
);
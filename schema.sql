-- Sunrise Multispecialty Hospital — starter database schema
-- Import this into MySQL to support the appointment form and a simple patient/doctor system.
-- This is a STARTING POINT for a developer to extend — not a production-ready auth system.

CREATE DATABASE IF NOT EXISTS sunrise_hospital CHARACTER SET utf8mb4;
USE sunrise_hospital;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  department_id INT,
  qualification VARCHAR(160),
  experience_years INT,
  consultation_timing VARCHAR(120),
  photo_url VARCHAR(255),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(120),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  email VARCHAR(120),
  department_id INT,
  doctor_id INT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  report_name VARCHAR(160) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  status ENUM('unpaid','paid') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Seed departments (matches the slugs used across the front-end)
INSERT INTO departments (slug, name) VALUES
('general','General Medicine'),('cardiology','Cardiology'),('orthopedics','Orthopedics'),
('gynecology','Gynecology & Obstetrics'),('pediatrics','Pediatrics'),('neurology','Neurology'),
('ent','ENT'),('dermatology','Dermatology'),('dentistry','Dentistry'),
('emergency','Emergency & Trauma'),('icu','ICU / Critical Care'),('lab','Laboratory & Diagnostics');

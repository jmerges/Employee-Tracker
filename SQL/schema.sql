DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

use employee_db;


CREATE TABLE department (
    department_id int AUTO_INCREMENT PRIMARY KEY,
    name varchar(30)
);


CREATE TABLE role (
    role_id int AUTO_INCREMENT PRIMARY KEY,
    title varchar(30),
    salary decimal,
    department_id int,
    CONSTRAINT fk_department
    FOREIGN KEY (department_id)
		REFERENCES department(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE employee (
    employee_id int AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id)
		REFERENCES role(role_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
	CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
		REFERENCES employee(employee_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
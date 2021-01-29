DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

use employee_db;


CREATE TABLE department (
    id int AUTO_INCREMENT PRIMARY KEY,
    name varchar(30)
);


CREATE TABLE role (
    id int AUTO_INCREMENT PRIMARY KEY,
    title varchar(30),
    salary decimal,
    department_id int,
    CONSTRAINT fk_department
    FOREIGN KEY (department_id)
		REFERENCES department(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE employee (
    id int AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id)
		REFERENCES role(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
		REFERENCES employee(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
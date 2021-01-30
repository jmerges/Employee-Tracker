var inquirer = require("inquirer");
var cTable = require("console.table");
var connection = require("./connection.js");
const { listenerCount } = require("./connection");
const { allowedNodeEnvironmentFlags } = require("process");

function startMenu () {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: ["Add Employee", "Add Department", "Add Role", "View Employees", "View Departments", "View Roles", "Update an Employee's Role"]
    }]).then(answer => {
        switch (answer.action) {
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "View Employees":
                view("employee");
                break;
            case "View Departments":
                view("department");
                break;
            case "View Roles":
                view("role");
                break;
            case "Update an Employee's Role":
                updateEmployeeRole();
                break;
        }
    });
}

function view(table) {
    var queryString = "SELECT * FROM "+table;
    connection.query(queryString, function(err, result) {
        if (err) throw err;
        console.table(result);
        startMenu();
    });
}

function addEmployee() {
    // Need to construct the role list and employee list
    var roleQuery = "SELECT role_id, title FROM role";
    connection.query(roleQuery, function(err, roleRes) {
        if (err) throw err;
        var roleList = [];
        roleRes.forEach(role => {
            roleList.push(role.title);
        });
        roleList.push("null");
        console.log(roleList);
        console.log(roleRes);

        empQuery = "SELECT employee_id, first_name, last_name FROM employee";
        connection.query(empQuery, function(err, empRes) {
            if (err) throw err;
            var empList = [];
            empRes.forEach(emp => {
                var fullName = emp.first_name + " " + emp.last_name;
                empList.push(fullName);
            });
            empList.push("null");
            console.log(empList);
            console.log(empRes);

            // After we have both lists, we do inquirer
            inquirer.prompt([{
                type: "input",
                message: "Enter employee's first name: ",
                name: "firstName"
            }, {
                type: "input",
                message: "Enter employee's last name: ",
                name: "lastName"
            }, {
                type: "list",
                message: "Choose employee's role",
                name: "role",
                choices: roleList
            }, {
                type: "list",
                message: "Choose employee's manager",
                name: "manager",
                choices: empList
            }]).then(empData => {
                var roleId = "null";
                roleRes.forEach(role => {
                    if (Object.values(role).includes(empData.role)) {
                        roleId = role.role_id;
                    }
                });
                var mgrName = empData.manager.split(" ");
                var mgrId = "null";
                empRes.forEach(emp => {
                    if (Object.values(emp).includes(mgrName[0]) && Object.values(emp).includes(mgrName[1])) {
                        mgrId = emp.employee_id;
                    }
                });
                console.log(roleId);
                var queryString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${empData.firstName}', '${empData.lastName}', ${roleId}, ${mgrId})`;
                connection.query(queryString, function(err, result) {
                    if (err) throw err;
                    view("employee");
                });
            });
        });
    });
};

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Enter the department name: "
    }]).then(answer => {
        var queryString = `INSERT INTO department (name) VALUES ('${answer.name}')`;
        connection.query(queryString, function(err, result) {
            if (err) throw err;
            view("department");
        });
    });
}

function addRole() {
    var depQuery = "SELECT department_id, name FROM department";
    connection.query(depQuery, function(err, depRes) {
        if (err) throw err;
        var depList = [];
        depRes.forEach(dep => {
            depList.push(dep.name);
        });
        depList.push("null");
        inquirer.prompt([{
            type: "input",
            name: "title",
            message: "Enter the role title: "
        }, {
            type: "input",
            name: "salary",
            message: "Enter the role's salary: "
        }, {
            type: "list",
            name: "department",
            message: "Choose the department",
            choices: depList
        }]).then(answer => {
            var depId = "null";
            depRes.forEach(dep => {
                if (Object.values(dep).includes(answer.department)) {
                    depId = dep.department_id;
                }
            });
            var queryString = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${depId})`;
            connection.query(queryString, function(err, result) {
                if (err) throw err;
                view("role");
            });
        });
    });
}

function updateEmployeeRole() {
    var roleQuery = "SELECT role_id, title FROM role";
    connection.query(roleQuery, function(err, roleRes) {
        if (err) throw err;
        var roleList = [];
        roleRes.forEach(role => {
            roleList.push(role.title);
        });
        roleList.push("null");
        console.log(roleList);
        console.log(roleRes);

        empQuery = "SELECT employee_id, first_name, last_name FROM employee";
        connection.query(empQuery, function(err, empRes) {
            if (err) throw err;
            var empList = [];
            empRes.forEach(emp => {
                var fullName = emp.first_name + " " + emp.last_name;
                empList.push(fullName);
            });
            console.log(empList);
            console.log(empRes);

            inquirer.prompt([{
                type: "list",
                message: "Choose an employee to update",
                name: "employee",
                choices: empList
            }, {
                type: "list",
                message: "Choose their new role",
                name: "role",
                choices: roleList
            }]).then(answer => {
                var roleId = "null";
                roleRes.forEach(role => {
                    if (Object.values(role).includes(answer.role)) {
                        roleId = role.role_id;
                    }
                });
                var empName = answer.employee.split(" ");
                var empId = "null";
                empRes.forEach(emp => {
                    if (Object.values(emp).includes(empName[0]) && Object.values(emp).includes(empName[1])) {
                        empId = emp.employee_id;
                    }
                });
                console.log(roleId);
                var queryString = `UPDATE employee SET role_id = ${roleId} WHERE first_name = '${empName[0]}' AND last_name = '${empName[1]}'`;
                connection.query(queryString, function(err, result) {
                    if (err) throw err;
                    view("employee");
                });
            });
        });
    });
}

startMenu();
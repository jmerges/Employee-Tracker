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

startMenu();
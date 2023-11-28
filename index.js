// Import necessary libraries
const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo");
const config = require("./package.json");

const department = require("./utils/department.js");
const role = require("./utils/role.js");
const employee = require("./utils/employee.js");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root", // MySQL username,
    password: "",
    database: "employee_tracker_db",
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

// Create an array of questions for user input
const mainQuestion = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "option",
    choices: [
      "View All Departments",
      "Add Department",
      "View All Employee",
      "Add Employee",
      "View All Roles",
      "Add Role",
      "Update Employee Role",
      "Quit",
    ],
  },
];

function processChoice(option) {
  if (option === "View All Departments") {
    department.viewAll(db);
    promptQuestion();
  } else if (option === "Add Department") {
    department.add(db);
  } else if (option === "View All Employee") {
    employee.viewAll(db);
  } else if (option === "Add Employee") {
    employee.add(db);
  } else if (option === "Update Employee Role") {
    employee.updateEmployeeRole(db);
  } else if (option === "View All Roles") {
    role.viewAll(db);
  } else if (option === "Add Role") {
    role.add(db);
  } else if (option === "Quit") {
    console.log("Program ended.");
    process.exit();
  }
}

function promptQuestion() {
  inquirer.prompt(mainQuestion).then((response) => {
    processChoice(response.option);
  });
}

// Function to initialize app
function init() {
  console.log(logo(config).render());
  promptQuestion();
}

// Function call to initialize app
init();

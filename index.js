// Import necessary libraries
const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo");
const config = require("./package.json");

// Import internal utils
const department = require("./utils/department.js");
const role = require("./utils/role.js");
const employee = require("./utils/employee.js");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
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
      "[Deparment] View All Departments",
      "[Deparment] Add Department",
      "[Deparment] View the total utilized budget of a department",
      "[Deparment] Delete Department",
      "[Employee] View All Employee",
      "[Employee] View Employees By Manager",
      "[Employee] View Employees By Department",
      "[Employee] Add Employee",
      "[Employee] Update Employee Role",
      "[Employee] Update Employee's Manager",
      "[Employee] Delete Employee",
      "[Role] View All Roles",
      "[Role] Add Role",
      "[Role] Delete Role",
      "***Quit***",
    ],
  },
]

// Process user inputs and invoke necessary functionality
async function processChoice(option) {
  if (option === "[Deparment] View All Departments") {
    await department.viewAll(db); // View all department
  } else if (option === "[Deparment] Add Department") {
    await department.addDepPrompt(db); // Add department
  } else if (option === "[Employee] View All Employee") {
    await employee.viewAll(db); // View All Employee
  } else if (option === "[Employee] Add Employee") {
    await employee.addEmployeePrompt(db); // Add Employee
  } else if (option === "[Employee] Update Employee Role") {
    await employee.updateEmployeeRolePrompt(db); // Update Employee Role
  } else if (option === "[Employee] Update Employee's Manager") {
    await employee.updateEmployeeManagerPrompt(db); // Update employee's manager
  } else if (option === "[Employee] View Employees By Manager") {
    await employee.viewEmployeeByManagerPrompt(db); // View employees by manager
  } else if (option === "[Employee] View Employees By Department") {
    await employee.viewEmployeeByDepartmentPrompt(db); // View employees by Department
  } else if (option === "[Role] View All Roles") {
    await role.viewAll(db); // View All Roles
  } else if (option === "[Role] Add Role") {
    await role.addRolePrompt(db); // Add Role
  } else if (option === "[Role] Delete Role") {
    await role.deleteRolePrompt(db); // Delete Role
  } else if (option === "[Deparment] Delete Department") {
    await department.deleteDepartmentPrompt(db); // Delete Department
  } else if (option === "[Employee] Delete Employee") {
    await employee.deleteEmployeePrompt(db); // Delete Employee
  } else if (option === "[Deparment] View the total utilized budget of a department") {
    await department.viewTotalBudgetOfDepartmentPrompt(db); // View the total utilized budget of a department
  } else if (option === "***Quit***") {
    console.log("Program ended."); 
    process.exit(); // Quit Program
  }

  // Re-prompt the main questions again
  promptQuestion();
}

// Prompt the main question set
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

// Program entry point
init();

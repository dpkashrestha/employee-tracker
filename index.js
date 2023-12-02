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
      "Update Employee's Manager",
      "View Employees By Manager",
      "View Employees By Department",
      "Delete department",
      "Delete role",
      "Delete employee",
      "Budget",
      "Quit",
    ],
  },
];

async function processChoice(option) {
  if (option === "View All Departments") {
   await department.viewAll(db); // View all department
    // promptQuestion();
  } else if (option === "Add Department") {
    await department.addDepPrompt(db); // Add department
    // promptQuestion();
  } else if (option === "View All Employee") {
    await employee.viewAll(db); // View All Employee
    // promptQuestion();
  } else if (option === "Add Employee") {
    await employee.addEmployeePrompt(db); // Add Employee
    // promptQuestion();
  } else if (option === "Update Employee Role") {
    await employee.updateEmployeePrompt(db); // Update Employee Role
    // promptQuestion();
  } else if (option === "Update Employee's Manager") {
    await employee.updateEmployeeManagerPrompt(db); // Update employee's manager
    // promptQuestion(); 
  } else if (option === "View Employees By Manager") {
    await employee.viewEmployeeByManagerPrompt(db); // View employees by manager
    // promptQuestion();
  } else if (option === "View Employees By Department") {
    await employee.viewEmployeeByDepartmentPrompt(db); // View employees by Department
    // promptQuestion();     
  } else if (option === "View All Roles") {
    await role.viewAll(db); // View All Roles
    // promptQuestion();
  } else if (option === "Add Role") {
    await role.addRolePrompt(db); // Add Role
    // promptQuestion();
  } else if (option === "Quit") {
    console.log("Program ended."); // Quit Program
    process.exit();
  }

  promptQuestion();
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

const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");

function viewAll(db) {
  db.query("SELECT * FROM employee", function (err, results) {
    logAsTable(results);
  });
}

function add(db) {
  console.log("addcall");
}

function updateEmployeeRole(db) {
  console.log("updatecall");
}
ß;
function logAsTable(results) {
  const table = new Table({
    head: ["ID", "First Name", "Last Name", "Role ID", "Manager ID"],
    colWidths: [5, 20, 20, 15, 15],
  });

  results.forEach((item) => {
    table.push([
      item.id,
      item.first_name,
      item.last_name,
      item.role_id,
      item.manager_id || "",
    ]);
  });

  console.log("\n" + table.toString());
}

const addEmployeeQuestions = [
  {
    type: "input",
    message: "What is the employee's first name??",
    name: "firstName",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "lastName",
  },
  {
    type: "input",
    message: "What is the employee's role?",
    name: "employeeRole",
  },
  {
    type: "input",
    message: "Who is the employee's manager?",
    name: "employeeManager",
  },
];

const updateEmployeeRoleQuestions = [
  {
    type: "input",
    message: "Which employee's role do you want to update?",
    name: "shapeColor",
  },
  {
    type: "input",
    message: "Which role do you want to assign the selected employee?",
    name: "shapeColor",
  },
  {
    type: "input",
    message: "What is the employee's role?",
    name: "shapeColor",
  },
];

module.exports = {
  viewAll,
  add,
  updateEmployeeRole,
};

const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");

const addRoleQuestions = [
  {
    type: "input",
    message: "What is the name of the role?",
    name: "shapeColor",
  },
  {
    type: "input",
    message: "What is the salary of the role?",
    name: "shapeColor",
  },
  {
    type: "input",
    message: "Which department does the role belong to?",
    name: "shapeColor",
  },
];

function viewAll(db) {
  db.query("SELECT * FROM role", function (err, results) {
    logAsTable(results);
  });
}

function add(db) {
  console.log("addcall");
}

function logAsTable(results) {
  const table = new Table({
    head: ["ID", "Title", "Salary", "Department ID"],
    colWidths: [5, 30, 20, 5],
  });

  results.forEach((item) => {
    table.push([item.id, item.title, item.salary, item.department_id]);
  });

  console.log("\n" + table.toString());
}

module.exports = {
  viewAll,
  add,
};

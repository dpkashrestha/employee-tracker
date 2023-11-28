const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");

const departmentQuestions = [
  {
    type: "input",
    message: "What is the name of the department?",
    name: "textColor",
  },
];

function viewAll(db) {
  db.query("SELECT * FROM department", function (err, results) {
    logAsTable(results);
  });
}
function add(db) {
  console.log("addcall");
}

function logAsTable(results) {
  const table = new Table({
    head: ["ID", "Department Name"],
    colWidths: [5, 30],
  });

  results.forEach((item) => {
    table.push([item.id, item.dep_name]);
  });

  console.log("\n" + table.toString());
}

module.exports = {
  viewAll,
  add,
};

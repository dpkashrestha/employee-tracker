const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");

const departmentQuestions = [
  {
    type: "input",
    message: "What is the name of the department?",
    name: "depName",
  },
];

function viewAll(db) {
  db.query("SELECT * FROM department", function (err, results) {
    logAsTable(results);
  });
}

async function getDepartmentChoices(db) {
  const [rows] = await db.promise().query('SELECT id, dep_name FROM department');
    // Map the database results to Inquirer choices format
    const choices = rows.map((item) => ({
      value: item.id,
      name: item.dep_name,
    }));

    return choices;
}

function addDepPrompt(db) {
  inquirer.prompt(departmentQuestions).then((response) => {
    addDep(db, response.depName);
  });
}

function addDep(db, depName) {
  db.query(
    `INSERT INTO department (dep_name)
  VALUES
      (?)`,
    depName,
    function (err, results) {
     console.log("Department added.");
    }
  );
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
  addDepPrompt,
  getDepartmentChoices,
};

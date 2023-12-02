const inquirer = require("inquirer");
const Table = require("cli-table3");

const departmentQuestions = [
  {
    type: "input",
    message: "What is the name of the department?",
    name: "depName",
  },
];

async function viewAll(db) {
  const [rows] = await db.promise().query('SELECT * FROM department');
  logAsTable(rows);
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

async function addDepPrompt(db) {
  await inquirer.prompt(departmentQuestions).then(async (response) => {
    await addDep(db, response.depName);
  });
}

async function addDep(db, depName) {
   await db.promise().query(
    `INSERT INTO department (dep_name)
  VALUES
      (?)`,
    depName
  );
  console.log("Department added.");
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

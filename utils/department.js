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
  const [rows] = await db.promise().query("SELECT * FROM department");
  logAsTable(rows);
}

async function getDepartmentChoices(db) {
  const [rows] = await db
    .promise()
    .query("SELECT id, dep_name FROM department");
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
  prettyLog("Department added.");
}

// Prompt questions to delete Department

async function deleteDepartmentPrompt(db) {
  const depChoices = await getDepartmentChoices(db);

  const deleteDepartmentQuestions = [
    {
      type: "list",
      message: "Which Department you want to delete?",
      name: "depId",
      choices: [...depChoices],
    },
  ];

  await inquirer.prompt(deleteDepartmentQuestions).then(async (response) => {
    await deleteDepartment(db, response.depId);
  });
}
// Query to delete Department
async function deleteDepartment(db, department_Id) {
  await db
    .promise()
    .query(`DELETE from Department where id = ?`, department_Id);
  prettyLog("Department deleted.");
}

// Query to View the total utilized budget of a department

async function viewTotalBudgetOfDepartmentPrompt(db) {
  const depChoices = await getDepartmentChoices(db);

  const totalBudgetQuestion = [
    {
      type: "list",
      message: "Which Department's total utilized budget do you want to view?",
      name: "depId",
      choices: [...depChoices],
    },
  ];

  await inquirer.prompt(totalBudgetQuestion).then(async (response) => {
    await getTotalBudgetForDepartment(db, response.depId);
  });
}

async function getTotalBudgetForDepartment(db, department_Id) {
  const queryString = `SELECT department.id, department.dep_name, sum(role.salary) as budget FROM department
  JOIN role ON role.department_id = department.id
  JOIN employee ON employee.role_id = role.id
  WHERE department.id = ?
  GROUP BY department.id`;

  const [rows] = await db.promise().query(queryString, department_Id);
  logTotalBudgetAsTable(rows);
}

function logTotalBudgetAsTable(results) {
  const table = new Table({
    head: ["ID", "Department Name", "Budget"],
    colWidths: [5, 30, 20],
  });

  results.forEach((item) => {
    table.push([item.id, item.dep_name, item.budget]);
  });

  console.log("\n" + table.toString() + "\n");
}

// Function to display data in table
function logAsTable(results) {
  const table = new Table({
    head: ["ID", "Department Name"],
    colWidths: [5, 30],
  });

  results.forEach((item) => {
    table.push([item.id, item.dep_name]);
  });

  console.log("\n" + table.toString() + "\n");
}

function prettyLog(message) {
  console.log("\n\n===============");
  console.log(message);
  console.log("================\n\n");
}

module.exports = {
  viewAll,
  addDepPrompt,
  getDepartmentChoices,
  deleteDepartmentPrompt,
  viewTotalBudgetOfDepartmentPrompt,
};

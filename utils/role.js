const inquirer = require("inquirer");
const Table = require("cli-table3");
const department = require("./department.js");

async function viewAll(db) {
  const [rows] = await db.promise()
    .query(`SELECT role.id, role.title, department.dep_name, role.salary FROM role
    JOIN department ON department.id = role.department_id`);
  logAsTable(rows);
}

async function getRoleChoices(db) {
  const [rows] = await db.promise().query("SELECT id, title FROM role");
  // Map the database results to Inquirer choices format
  const choices = rows.map((item) => ({
    value: item.id,
    name: item.title,
  }));

  return choices;
}

// Prompt questions to add role
async function addRolePrompt(db) {
  const depChoices = await department.getDepartmentChoices(db);

  const addRoleQuestions = [
    {
      type: "input",
      message: "What is the name of the role?",
      name: "roleTitle",
    },
    {
      type: "input",
      message: "What is the salary of the role?",
      name: "roleSalary",
    },
    {
      type: "list",
      message: "Which department does the role belong to?",
      name: "roleDepId",
      choices: [...depChoices],
    },
  ];

  await inquirer.prompt(addRoleQuestions).then(async (response) => {
    await addRole(
      db,
      response.roleTitle,
      response.roleSalary,
      response.roleDepId
    );
  });
}
// Query to add role
async function addRole(db, roleTitle, roleSalary, roleDepId) {
  await db.promise().query(
    `INSERT INTO role (title, salary, department_id)
VALUES
    (?,?,?)`,
    [roleTitle, roleSalary, roleDepId]
  );
  prettyLog("Role added.");
}

// Prompt questions to delete role

async function deleteRolePrompt(db) {
  const roleChoices = await getRoleChoices(db);

  const deleteRoleQuestions = [
    {
      type: "list",
      message: "Which role you want to delete?",
      name: "roleId",
      choices: [...roleChoices],
    },
  ];

  await inquirer.prompt(deleteRoleQuestions).then(async (response) => {
    await deleteRole(db, response.roleId);
  });
}
// Query to delete role
async function deleteRole(db, roleId) {
  await db.promise().query(`DELETE from role where id = ?`, roleId);
  prettyLog("Role deleted.");
}

// Function to display data in table
function logAsTable(results) {
  const table = new Table({
    head: ["ID", "Title", "Department", "Salary"],
    colWidths: [5, 30, 20, 20],
  });

  results.forEach((item) => {
    table.push([item.id, item.title, item.dep_name, item.salary]);
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
  addRolePrompt,
  getRoleChoices,
  deleteRolePrompt,
};

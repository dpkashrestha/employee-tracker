const inquirer = require("inquirer");
const department = require("./department.js");
const logger = require("./logger.js");

// Function to build choice list for roles for prompt questions
async function getRoleChoices(db) {
  const [rows] = await db.promise().query("SELECT id, title FROM role");

  // Map the database results to Inquirer choices format
  const choices = rows.map((item) => ({
    value: item.id,
    name: item.title,
  }));

  return choices;
}

// View all roles functionality
async function viewAll(db) {
  const [rows, fields] = await db.promise()
    .query(`SELECT role.id, role.title, department.dep_name, role.salary FROM role
    JOIN department ON department.id = role.department_id`);
  logger.logAsTable(rows, fields);
}

// Prompts to add role
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
  logger.prettyLog("Role added.");
}

// Prompt to delete role
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
  logger.prettyLog("Role deleted.");
}

module.exports = {
  viewAll,
  addRolePrompt,
  getRoleChoices,
  deleteRolePrompt,
};

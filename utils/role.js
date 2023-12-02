const inquirer = require("inquirer");
const Table = require("cli-table3");
const department = require("./department.js");

async function viewAll(db) {
  const [rows] = await db.promise().query(`SELECT role.id, role.title, department.dep_name, role.salary FROM role
    JOIN department ON department.id = role.department_id`);
  logAsTable(rows);
}

async function getRoleChoices(db) {
  const [rows] = await db.promise().query('SELECT id, title FROM role');
    // Map the database results to Inquirer choices format
    const choices = rows.map((item) => ({
      value: item.id,
      name: item.title,
    }));

    return choices;
}

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
      choices: [...depChoices]
    },
  ];

  await inquirer.prompt(addRoleQuestions).then(async (response) => {
    await addRole(db, response.roleTitle, response.roleSalary, response.roleDepId);
  });
}

async function addRole(db,roleTitle, roleSalary, roleDepId) {
  await db.promise().query(
    `INSERT INTO role (title, salary, department_id)
VALUES
    (?,?,?)`, [roleTitle, roleSalary, roleDepId]
  );
  console.log("Role added.");
}

function logAsTable(results) {
  const table = new Table({
    head: ["ID", "Title", "Department", "Salary"],
    colWidths: [5, 30, 20, 20],
  });

  results.forEach((item) => {
    table.push([item.id, item.title, item.dep_name, item.salary]);
  });

  console.log("\n" + table.toString());
}

module.exports = {
  viewAll,
  addRolePrompt,
  getRoleChoices,
};

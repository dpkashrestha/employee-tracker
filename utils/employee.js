const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");
const role = require("./role.js");

function viewAll(db) {
  const queryString = `
  SELECT
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.dep_name,
    role.salary,
    CONCAT(e2.first_name, ' ', e2.last_name) as manager
  FROM
    employee
    JOIN role ON role.id = employee.role_id
    JOIN department ON department.id = role.department_id
    LEFT JOIN employee e2 ON e2.id = employee.manager_id
`;

  db.query(queryString, function (err, results) {
    console.log(results);
    logAsTable(results);
  });
}

async function getEmployeeChoices(db) {
  const [rows] = await db
    .promise()
    .query(
      `SELECT id, concat(first_name, ' ', last_name) as employeeName FROM employee`
    );
  // Map the database results to Inquirer choices format
  const choices = rows.map((item) => ({
    value: item.id,
    name: item.employeeName,
  }));

  return choices;
}

async function addEmployeePrompt(db) {
  const managerChoices = await getEmployeeChoices(db);

  const roleChoices = await role.getRoleChoices(db);

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
      type: "list",
      message: "What is the employee's role?",
      name: "roleId",
      choices: [...roleChoices],
    },
    {
      type: "list",
      message: "Who is the employee's manager?",
      name: "managerId",
      choices: [...managerChoices],
    },
  ];

  inquirer.prompt(addEmployeeQuestions).then((response) => {
    addEmployee(
      db,
      response.firstName,
      response.lastName,
      response.roleId,
      response.managerId
    );
  });
}

function addEmployee(db, firstName, lastName, employeeRole, employeeManager) {
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
    [firstName, lastName, employeeRole, employeeManager],
    function (err, results) {
      console.log("Employee added.");
    }
  );
}

async function updateEmployeePrompt(db) {
  const employeeChoices = await getEmployeeChoices(db);

  const roleChoices = await role.getRoleChoices(db);

  const updateEmployeeQuestions = [
    {
      type: "list",
      message: "Which employee's role do you want to update?",
      name: "empId",
      choices: [...employeeChoices],
    },
    {
      type: "list",
      message: "Which role do you want to assign the selected employee?",
      name: "roleId",
      choices: [...roleChoices],
    },
  ];

  inquirer.prompt(updateEmployeeQuestions).then((response) => {
    updateEmployee(db, response.roleId, response.empId);
  });
}

function updateEmployee(db, roleId, employeeId) {
  db.query(
    `UPDATE employee SET role_id=? WHERE id = ?`,
    [roleId, employeeId],
    function (err, results) {
      console.log("Employee updated.");
    }
  );
}

function logAsTable(results) {
  const table = new Table({
    head: [
      "ID",
      "First Name",
      "Last Name",
      "Title",
      "Department",
      "Salary",
      "Manager",
    ],
    colWidths: [5, 20, 20, 25, 20, 20, 30],
  });

  results.forEach((item) => {
    table.push([
      item.id,
      item.first_name,
      item.last_name,
      item.title,
      item.dep_name,
      item.salary,
      item.manager || "",
    ]);
  });

  console.log("\n" + table.toString());
}

module.exports = {
  viewAll,
  addEmployeePrompt,
  updateEmployeePrompt,
};

const inquirer = require("inquirer");
const Table = require("cli-table3");
const role = require("./role.js");
const department = require("./department.js");

async function viewAll(db) {
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

  const [rows] = await db.promise().query(queryString);
  logAsTable(rows);
}

async function getEmployeeChoices(db) {
  const queryString = `SELECT id, concat(first_name, ' ', last_name) as employeeName FROM employee`;

  const [rows] = await db.promise().query(queryString);

  // Map the database results to Inquirer choices format
  const choices = rows.map((item) => ({
    value: item.id,
    name: item.employeeName,
  }));

  return choices;
}

async function getManagerChoices(db) {
  const queryString = `SELECT id, concat(first_name, ' ', last_name) as managerName FROM employee`;

  const [rows] = await db.promise().query(queryString);

  // Map the database results to Inquirer choices format
  const choices = rows.map((item) => ({
    value: item.id,
    name: item.managerName,
  }));

  return choices;
}

// Prompt questions to add employee
async function addEmployeePrompt(db) {
  const managerChoices = await getEmployeeChoices(db);

  const roleChoices = await role.getRoleChoices(db);

  const addEmployeeQuestions = [
    {
      type: "input",
      message: "What is the employee's first name?",
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
      choices: ["None", ...managerChoices],
    },
  ];

  await inquirer.prompt(addEmployeeQuestions).then(async (response) => {
    await addEmployee(
      db,
      response.firstName,
      response.lastName,
      response.roleId,
      response.managerId
    );
  });
}

// Query to add employee
async function addEmployee(
  db,
  firstName,
  lastName,
  employeeRole,
  employeeManager
) {
  if (employeeManager === "None") {
    employeeManager = null;
  }

  await db
    .promise()
    .query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [firstName, lastName, employeeRole, employeeManager]
    );

  prettyLog("Employee added.");
}

// Prompt questions to update employee
async function updateEmployeeRolePrompt(db) {
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

  await inquirer.prompt(updateEmployeeQuestions).then(async (response) => {
    await updateEmployee(db, response.roleId, response.empId);
  });
}

//Query to update employee
async function updateEmployeeRole(db, roleId, employeeId) {
  await db
    .promise()
    .query(`UPDATE employee SET role_id=? WHERE id = ?`, [roleId, employeeId]);

  prettyLog("Employee Role updated.");
}

// Prompt questions to update employee managers
async function updateEmployeeManagerPrompt(db) {
  const employeeChoices = await getEmployeeChoices(db);

  const managerChoices = await getManagerChoices(db);

  const updateEmployeeManagerQuestions = [
    {
      type: "list",
      message: "Which employee's manager do you want to update?",
      name: "empId",
      choices: [...employeeChoices],
    },
    {
      type: "list",
      message: "Which manager do you want to assign the selected employee?",
      name: "managerId",
      choices: [...managerChoices],
    },
  ];

  await inquirer
    .prompt(updateEmployeeManagerQuestions)
    .then(async (response) => {
      await updateEmployeeManager(db, response.empId, response.managerId);
    });
}

//Query to update employee's manager
async function updateEmployeeManager(db, employeeId, managerId) {
  await db
    .promise()
    .query(`UPDATE employee SET manager_id=? WHERE id = ?`, [
      managerId,
      employeeId,
    ]);
  prettyLog("Employee Manager updated.");
}

// View employees by manager
async function viewEmployeeByManagerPrompt(db) {
  const employeeChoices = await getEmployeeChoices(db);

  const viewEmployeeByManagerQuestions = [
    {
      type: "list",
      message: "Which manager do you want to view the employees for?",
      name: "managerId",
      choices: [...employeeChoices],
    },
  ];

  await inquirer
    .prompt(viewEmployeeByManagerQuestions)
    .then(async (response) => {
      await viewEmployeeByManager(db, response.managerId);
    });
}

async function viewEmployeeByManager(db, managerId) {
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
      WHERE
        employee.manager_id = ?
    `;

  const [rows] = await db.promise().query(queryString, managerId);
  logAsTable(rows);
}

// View employees by Department
async function viewEmployeeByDepartmentPrompt(db) {
  const departmentChoices = await department.getDepartmentChoices(db);

  const queryString = [
    {
      type: "list",
      message: "Which Department do you want to view the employees for?",
      name: "depId",
      choices: [...departmentChoices],
    },
  ];

  await inquirer.prompt(queryString).then(async (response) => {
    await viewEmployeeByDepartment(db, response.depId);
  });
}

async function viewEmployeeByDepartment(db, depId) {
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
      WHERE
        department.id = ?
    `;

  const [rows] = await db.promise().query(queryString, depId);
  logAsTable(rows);
}

// Prompt questions to delete Employee

async function deleteEmployeePrompt(db) {
  const employeeChoices = await getEmployeeChoices(db);

  const deleteEmployeeQuestions = [
    {
      type: "list",
      message: "Which Employee you want to delete?",
      name: "employeeId",
      choices: [...employeeChoices],
    },
  ];

  await inquirer.prompt(deleteEmployeeQuestions).then(async (response) => {
    await deleteEmployee(db, response.employeeId);
  });
}
// Query to delete Employee
async function deleteEmployee(db, empId) {
  await db.promise().query(`DELETE from Employee where id = ?`, empId);
  prettyLog("Employee deleted.");
}

// Function to display data in the table
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
      item.manager || "<Not Assigned>",
    ]);
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
  addEmployeePrompt,
  updateEmployeeRolePrompt,
  updateEmployeeManagerPrompt,
  getManagerChoices,
  viewEmployeeByManagerPrompt,
  viewEmployeeByDepartmentPrompt,
  deleteEmployeePrompt,
};

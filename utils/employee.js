const inquirer = require("inquirer");
const role = require("./role.js");
const department = require("./department.js");
const logger = require("./logger.js");

// Function to build choice list for employees for prompt questions
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

// Function to build choice list for managers for prompt questions
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

// View all employees functionality
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

  const [rows, fields] = await db.promise().query(queryString);
  logger.logAsTable(rows, fields);
}

// Prompts to add employee
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

  logger.prettyLog("Employee added.");
}

// Prompts to update employee
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
    await updateEmployeeRole(db, response.roleId, response.empId);
  });
}

// Query to update employee
async function updateEmployeeRole(db, roleId, employeeId) {
  await db
    .promise()
    .query(`UPDATE employee SET role_id=? WHERE id = ?`, [roleId, employeeId]);

  logger.prettyLog("Employee Role updated.");
}

// Prompts to update employee's manager
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

// Query to update employee's manager
async function updateEmployeeManager(db, employeeId, managerId) {
  await db
    .promise()
    .query(`UPDATE employee SET manager_id=? WHERE id = ?`, [
      managerId,
      employeeId,
    ]);
  logger.prettyLog("Employee Manager updated.");
}

// Prompt to view employees by manager
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

// Query to view employees by manager
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

  const [rows, fields] = await db.promise().query(queryString, managerId);
  logger.logAsTable(rows, fields);
}

// Prompt to view employees by Department
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

// Query to view employees by department
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

  const [rows, fields] = await db.promise().query(queryString, depId);
  logger.logAsTable(rows, fields);
}

// Prompt to delete Employee
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
  logger.prettyLog("Employee deleted.");
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

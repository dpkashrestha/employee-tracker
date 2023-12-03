const Table = require("cli-table3");

function logAsTable(rows, fields) {
  const fieldNames = fields.map((field) => field.name);
  const rowValues = rows.map((row) => Object.values(row));

  const table = new Table({
    head: fieldNames,
  });

  rowValues.forEach((item) => {
    table.push(item);
  });

  console.log("\n" + table.toString() + "\n");
}

function prettyLog(message) {
  console.log("\n\n===============");
  console.log(message);
  console.log("================\n\n");
}

module.exports = {
  logAsTable,
  prettyLog,
};

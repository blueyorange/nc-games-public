const db = require("../connection");
const format = require("pg-format");
const fs = require("fs/promises");

const dropTables = async (tableNamesInDropOrder) => {
  try {
    for (const tableName of tableNamesInDropOrder) {
      await db.query(`DROP TABLE IF EXISTS ${tableName}`);
    }
  } catch (err) {
    console.log(err);
  }
};

const createTables = async (tableNamesInCreateOrder) => {
  try {
    for (const tableName of tableNamesInCreateOrder) {
      const sql = await fs.readFile(
        `${__dirname}/sql/${tableName}.sql`,
        "utf-8"
      );
      await db.query(sql);
    }
  } catch (err) {
    console.log(err);
  }
};

const insertDataIntoTable = async (data, tableName) => {
  const columnNames = Object.keys(data[0]);
  const columnNameString = columnNames.reduce(
    (output, current) => `${output}, ${current}`
  );
  console.log(columnNameString);
  const formattedValues = data.map((obj) => Object.values(obj));
  //console.log(formattedValues);
  const sql = format(
    `INSERT INTO ${tableName} (${columnNameString}) VALUES %L`,
    formattedValues
  );
  console.log(sql);
  try {
    await db.query(sql);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { dropTables, createTables, insertDataIntoTable };

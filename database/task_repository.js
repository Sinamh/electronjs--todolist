const { existsSync } = require("node:fs");
const path = require("path");

class TaskRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT,
          taskstate INTEGER DEFAULT 0)`;
    return this.dao.run(sql);
  }

  clearTable() {
    return this.dao.run(`DELETE FROM tasks`);
  }

  create(description) {
    return this.dao.run("INSERT INTO tasks (description) VALUES (?)", [
      description,
    ]);
  }

  update(task) {
    const { id, description, taskstate } = task;
    return this.dao.run(
      `UPDATE tasks SET description = ?, taskstate = ? WHERE id = ?`,
      [description, taskstate, id]
    );
  }

  delete(id) {
    return this.dao.run(`DELETE FROM tasks WHERE id = ?`, [id]);
  }

  getById(id) {
    return this.dao.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
  }

  getAll() {
    return this.dao.all(`SELECT * FROM tasks`);
  }

  resetTable() {
    return this.dao.run(
      "UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM tasks) WHERE name = 'tasks'"
    );
  }
}

module.exports = TaskRepository;

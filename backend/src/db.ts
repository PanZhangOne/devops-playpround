import { Pool } from "pg";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: Date;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * 进行数据库表检查
 * 需要有 tasks 表，包含 id, title, completed, created_at 四个字段
 * id 是主键，title 是文本，completed 是布尔值，created_at 是时间戳
 * 如果表不存在，则创建表
 */
export const checkTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export async function getCout() {
  const res = await pool.query("select count(*) from tasks");
}

export async function getTask() {
  const res = await pool.query("select * from tasks");
  return res.rows as Task[];
}

export async function setComplete(id: string, completed: boolean) {
  await pool.query("UPDATE tasks SET completed = $1 WHERE id = $2", [
    completed,
    id,
  ]);
}

export async function deleteTask(id: string) {
  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
}

// 创建任务 传递 title 参数，自动生成 id 和 created_at，completed 默认为 false
export async function addTask(title: string) {
  await pool.query("insert into tasks (title) values ($1)", [title]);
}

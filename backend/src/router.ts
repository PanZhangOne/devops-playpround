import { Router } from "express";
import { addTask, getTask } from "./db.js";

const router: ReturnType<typeof Router> = Router();

router.get("/tasks", async (req, res) => {
  res.json({ data: await getTask() });
});

router.post("/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  await addTask(title);
  res.status(201).json({ message: "Task added successfully" });
});


export default router;
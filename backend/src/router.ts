import { Router } from "express";
import { addTask, getTask, setComplete } from "./db.js";

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

router.post("/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;
  await setComplete(id, true);
  res.json({ message: "Task marked as completed" });
});

export default router;

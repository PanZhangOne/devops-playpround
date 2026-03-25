import express from "express";
import { fileURLToPath } from "node:url";
import taskRouter from "./router.js";
import { checkTable, getCout } from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await getCout();
    res
      .status(200)
      .json({ status: "ok", message: "Database connection successful" });
  } catch {
    res
      .status(503)
      .json({ status: "error", message: "Database connection failed" });
  }
});

app.use("/api", taskRouter);

export async function startServer() {
  try {
    await checkTable();
  } catch (error) {
    console.error("Error checking database table:", error);
    process.exit(1);
  }

  const port = Number(process.env.PORT) || 8080;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  void startServer();
}

export default app;

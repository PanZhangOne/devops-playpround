import express from "express";
import taskRouter from "./router.js";
import { checkTable, getCout } from "./db.js";

// 先进行数据库检查
try {
  await checkTable();
} catch (error) {
  console.error("Error checking database table:", error);
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await getCout();
    res
      .status(200)
      .json({ status: "ok", message: "Database connection successful" });
  } catch (error) {
    res
      .status(503)
      .json({ status: "error", message: "Database connection failed" });
  }
});

app.use("/api", taskRouter);

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

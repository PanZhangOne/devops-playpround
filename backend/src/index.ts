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
app.use("/api", taskRouter);

app.use("/api/health", async (req, res) => {
  try {
    await getCout();
    res.json({ status: "ok", message: "Database connection successful" });
  } catch (error) {
    res.json({ status: "error", message: "Database connection failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

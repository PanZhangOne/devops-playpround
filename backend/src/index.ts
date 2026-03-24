import express from "express";
import taskRouter from "./router.js";
import { checkTable } from "./db.js";

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

app.use("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

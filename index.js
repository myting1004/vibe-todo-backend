import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todosRouter from "./routes/todos.js";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo backend is running");
});

app.use("/todos", todosRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("연결 성공");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB 연결 실패:", err.message);
    process.exit(1);
  });

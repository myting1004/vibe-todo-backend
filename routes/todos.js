import { Router } from "express";
import mongoose from "mongoose";
import Todo from "../models/Todo.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body ?? {};

    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ message: "할일 제목(title)은 필수입니다." });
    }

    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
    });

    return res.status(201).json(todo);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "입력값이 올바르지 않습니다.",
        errors: Object.fromEntries(
          Object.entries(err.errors).map(([key, value]) => [key, value.message])
        ),
      });
    }

    console.error("할일 생성 실패:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { completed, priority, sort } = req.query;
    const filter = {};

    if (completed === "true") filter.completed = true;
    else if (completed === "false") filter.completed = false;

    if (typeof priority === "string" && priority !== "") {
      filter.priority = priority;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      due: { dueDate: 1, createdAt: -1 },
    };
    const sortOption = sortMap[sort] ?? sortMap.newest;

    const todos = await Todo.find(filter).sort(sortOption);
    return res.json({ count: todos.length, items: todos });
  } catch (err) {
    console.error("할일 목록 조회 실패:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "유효하지 않은 id 입니다." });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    return res.json(todo);
  } catch (err) {
    console.error("할일 단건 조회 실패:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "유효하지 않은 id 입니다." });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    const allowed = ["title", "description", "completed", "priority", "dueDate"];
    const updates = req.body ?? {};
    let changed = false;

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        todo[key] = updates[key];
        changed = true;
      }
    }

    if (!changed) {
      return res
        .status(400)
        .json({ message: "수정할 필드가 없습니다." });
    }

    const saved = await todo.save();
    return res.json(saved);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "입력값이 올바르지 않습니다.",
        errors: Object.fromEntries(
          Object.entries(err.errors).map(([key, value]) => [key, value.message])
        ),
      });
    }

    console.error("할일 수정 실패:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "유효하지 않은 id 입니다." });
    }

    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    return res.status(204).end();
  } catch (err) {
    console.error("할일 삭제 실패:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;

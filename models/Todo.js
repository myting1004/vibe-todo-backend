import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "할일 제목은 필수입니다."],
      trim: true,
      maxlength: [200, "할일 제목은 200자를 넘을 수 없습니다."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "상세 설명은 2000자를 넘을 수 없습니다."],
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

todoSchema.index({ completed: 1, createdAt: -1 });
todoSchema.index({ dueDate: 1 });

todoSchema.pre("save", function (next) {
  if (this.isModified("completed")) {
    this.completedAt = this.completed ? new Date() : null;
  }
  next();
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;

import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
     
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔥 add this
    },
    company: String,
    jobrole: String,
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("jobs", JobSchema,"jobs");
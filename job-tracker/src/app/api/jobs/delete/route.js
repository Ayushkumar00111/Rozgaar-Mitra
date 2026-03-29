import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export async function DELETE(req) {
  await connectDB();

  const { id } = await req.json();

  await Job.findByIdAndDelete(id);

  return Response.json({ message: "Deleted" });
}
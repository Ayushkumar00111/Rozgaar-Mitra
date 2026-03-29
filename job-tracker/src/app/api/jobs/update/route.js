import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export async function PUT(req) {
  await connectDB();

  const { id, status } = await req.json();

  const job = await Job.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  return Response.json(job);
}
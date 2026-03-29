import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { getUserFromToken } from "@/utils/getUser";

export async function GET(req) {
  await connectDB();

  const user = getUserFromToken(req);

  if (!user) {
    return Response.json([]);
  }

  const jobs = await Job.find({ userId: user.id });

  return Response.json(jobs);
}

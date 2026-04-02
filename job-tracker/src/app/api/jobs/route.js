import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { getUserFromToken } from "@/utils/getUser";

export async function GET(req) {
  await connectDB();

  
  const jobs = await Job.find();

  return Response.json(jobs);
}
